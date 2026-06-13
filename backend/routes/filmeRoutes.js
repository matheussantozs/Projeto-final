import { Router } from 'express'
import { autenticar, somenteAdmin } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

export default function filmeRoutes(filmeController) {
  const router = Router()

  router.get('/', autenticar, filmeController.listar)
  router.get('/:id', autenticar, filmeController.buscarPorId)
  router.post('/', autenticar, somenteAdmin, upload.single('capa'), filmeController.cadastrar)
  router.put('/:id', autenticar, somenteAdmin, upload.single('capa'), filmeController.atualizar)
  router.delete('/:id', autenticar, somenteAdmin, filmeController.deletar)

  return router
}
