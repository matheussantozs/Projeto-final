import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const JWT_SECRET = process.env.JWT_SECRET || 'troque-esta-chave-em-producao'
const SALT_ROUNDS = 10

function acessoValido(acesso) {
  return ['COMUM', 'ADMINISTRADOR'].includes(acesso)
}

export default class AuthController {
  constructor(usuarioDAO) {
    this.usuarioDAO = usuarioDAO
  }

  cadastrar = async (req, res) => {
    const { email, nome, senha, tipo, acesso } = req.body
    const acessoFinal = acesso || tipo || 'COMUM'

    if (!email || !nome || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' })
    }

    if (!acessoValido(acessoFinal)) {
      return res.status(400).json({ erro: 'Tipo de acesso inválido.' })
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' })
    }

    try {
      const usuarioExistente = await this.usuarioDAO.getByEmail(email)
      if (usuarioExistente) {
        return res.status(409).json({ erro: 'Já existe um usuário com este email.' })
      }

      const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS)
      const usuario = await this.usuarioDAO.insert(new Usuario(null, email, nome, senhaHash, acessoFinal))

      return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', usuario })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' })
    }
  }

  login = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios.' })
    }

    try {
      const usuario = await this.usuarioDAO.getByEmail(email)
      if (!usuario) {
        return res.status(401).json({ erro: 'Email ou senha incorretos.' })
      }

      let senhaCorreta = false

      if (usuario.senha.startsWith('$2')) {
        senhaCorreta = await bcrypt.compare(senha, usuario.senha)
      } else {
        senhaCorreta = usuario.senha === senha
        if (senhaCorreta) {
          const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS)
          await this.usuarioDAO.updatePassword(usuario.id, senhaHash)
        }
      }

      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Email ou senha incorretos.' })
      }

      const payload = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        acesso: usuario.acesso
      }

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' })

      return res.json({
        mensagem: 'Login realizado com sucesso.',
        token,
        usuario: usuario.toJSON()
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ erro: 'Erro ao realizar login.' })
    }
  }

  perfil = async (req, res) => {
    return res.json({ usuario: req.usuario })
  }
}
