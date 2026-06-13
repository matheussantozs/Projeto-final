import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import UsuarioDAO from './daos/UsuarioDAO.js'
import FilmeDAO from './daos/FilmeDAO.js'
import AuthController from './controllers/authController.js'
import FilmeController from './controllers/filmeController.js'
import authRoutes from './routes/authRoutes.js'
import filmeRoutes from './routes/filmeRoutes.js'
import { ensureBucket } from './services/minioService.js'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../frontend')))

const usuarioDAO = await UsuarioDAO.build()
const filmeDAO = await FilmeDAO.build()

try {
  await ensureBucket()
  console.log('Bucket do MinIO configurado para leitura pública.')
} catch (error) {
  console.warn('Não foi possível configurar o MinIO na inicialização:', error.message)
}

const authController = new AuthController(usuarioDAO)
const filmeController = new FilmeController(filmeDAO)

app.use('/api/auth', authRoutes(authController))
app.use('/api/filmes', filmeRoutes(filmeController))

app.post('/cadastrar', authController.cadastrar)
app.post('/login', authController.login)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'))
})

app.use((err, req, res, next) => {
  console.error(err)
  return res.status(400).json({ erro: err.message || 'Erro na requisição.' })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})

