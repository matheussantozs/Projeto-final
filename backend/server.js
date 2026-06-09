import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import Usuario from './models/Usuario.js'
import UsuarioDAO from './daos/UsuarioDAO.js'

const app = express()
const PORT = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

// serve os arquivos da pasta frontend
app.use(express.static(path.join(__dirname, '../frontend')))

const dao = await UsuarioDAO.build()

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'))
})



app.post('/cadastrar', async (req, res) => {
  const { email, nome, senha, tipo } = req.body

  if (!email || !nome || !senha || !tipo) {
    return res.status(400).json({ erro: 'Campos não preenchidos' })
  }

  try {
    await dao.insert(new Usuario(null, email, nome, senha, tipo))
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' })
  }
})


app.post('/login', async (req, res) => {
  const { email, senha } = req.body

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha obrigatórios.' })
  }

  try {
    const usuario = await dao.getByEmail(email)

    if (!usuario || usuario.senha != senha) {
      return res.status(401).json({ erro: 'Email ou senha incorretos.' })
    }

    res.json({ mensagem: 'Login realizado com sucesso!', usuario })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'Erro ao realizar login.' })
  }
})


app.delete('/usuario/:id', async (req, res) => {
  const { id } = req.params
  try {
    await dao.delete(id)
    res.json({mensagem: 'Usuario deletado'})
  } catch (err) {
    console.error(err)
    res.status(500).json({error :  'Erro ao deletar'})
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})