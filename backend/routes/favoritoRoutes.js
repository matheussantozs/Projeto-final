import { Router } from 'express'
import { autenticar } from '../middlewares/authMiddleware.js'

export default function favoritoRoutes(favoritoController) {
  const router = Router()

  router.get('/', autenticar, favoritoController.listar)
  router.post('/:filmeId', autenticar, favoritoController.adicionar)
  router.delete('/:filmeId', autenticar, favoritoController.remover)

  return router
}
