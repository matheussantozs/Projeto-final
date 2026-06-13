import Filme from '../models/Filme.js'
import { uploadCapa } from '../services/minioService.js'

function validarFilme({ titulo, ano, sinopse, diretor, genero }) {
  if (!titulo || !ano || !sinopse || !diretor || !genero) {
    return 'Título, ano, sinopse, diretor e gênero são obrigatórios.'
  }

  const anoNumerico = Number(ano)
  const anoAtual = new Date().getFullYear() + 5

  if (!Number.isInteger(anoNumerico) || anoNumerico < 1888 || anoNumerico > anoAtual) {
    return 'Ano do filme inválido.'
  }

  return null
}

export default class FilmeController {
  constructor(filmeDAO) {
    this.filmeDAO = filmeDAO
  }

  listar = async (req, res) => {
    const filmes = await this.filmeDAO.getAll()
    return res.json(filmes)
  }

  buscarPorId = async (req, res) => {
    const filme = await this.filmeDAO.getById(req.params.id)

    if (!filme) {
      return res.status(404).json({ erro: 'Filme não encontrado.' })
    }

    return res.json(filme)
  }

  cadastrar = async (req, res) => {
    const erro = validarFilme(req.body)
    if (erro) return res.status(400).json({ erro })

    try {
      const capaUrl = await uploadCapa(req.file)
      const filme = new Filme(
        null,
        req.body.ano,
        req.body.titulo,
        req.body.sinopse,
        req.body.diretor,
        req.body.genero,
        capaUrl
      )

      const filmeCriado = await this.filmeDAO.insert(filme)
      return res.status(201).json({ mensagem: 'Filme cadastrado com sucesso.', filme: filmeCriado })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ erro: 'Erro ao cadastrar filme.' })
    }
  }

  atualizar = async (req, res) => {
    const filmeAtual = await this.filmeDAO.getById(req.params.id)

    if (!filmeAtual) {
      return res.status(404).json({ erro: 'Filme não encontrado.' })
    }

    const dados = {
      titulo: req.body.titulo ?? filmeAtual.titulo,
      ano: req.body.ano ?? filmeAtual.ano,
      sinopse: req.body.sinopse ?? filmeAtual.sinopse,
      diretor: req.body.diretor ?? filmeAtual.diretor,
      genero: req.body.genero ?? filmeAtual.genero
    }

    const erro = validarFilme(dados)
    if (erro) return res.status(400).json({ erro })

    try {
      const novaCapaUrl = req.file ? await uploadCapa(req.file) : filmeAtual.capaUrl
      const filme = new Filme(
        filmeAtual.id,
        dados.ano,
        dados.titulo,
        dados.sinopse,
        dados.diretor,
        dados.genero,
        novaCapaUrl
      )

      const filmeAtualizado = await this.filmeDAO.update(filme)
      return res.json({ mensagem: 'Filme atualizado com sucesso.', filme: filmeAtualizado })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ erro: 'Erro ao atualizar filme.' })
    }
  }

  deletar = async (req, res) => {
    const filme = await this.filmeDAO.getById(req.params.id)

    if (!filme) {
      return res.status(404).json({ erro: 'Filme não encontrado.' })
    }

    await this.filmeDAO.delete(req.params.id)
    return res.json({ mensagem: 'Filme deletado com sucesso.' })
  }
}
