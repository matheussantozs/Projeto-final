import { Router } from 'express'
import { autenticar } from '../middlewares/authMiddleware.js'

export default function authRoutes(authController) {
  const router = Router()

  router.post('/cadastrar', authController.cadastrar)
  router.post('/login', authController.login)
  router.get('/perfil', autenticar, authController.perfil)

  return router
}
