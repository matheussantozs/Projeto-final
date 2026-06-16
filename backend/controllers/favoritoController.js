export default class FavoritoController {
  constructor(favoritoDAO, filmeDAO) {
    this.favoritoDAO = favoritoDAO
    this.filmeDAO = filmeDAO
  }

  listar = async (req, res) => {
    try {
      const filmes = await this.favoritoDAO.getFilmesByUsuario(req.usuario.id)
      return res.json(filmes)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ erro: 'Erro ao listar filmes favoritos.' })
    }
  }

  adicionar = async (req, res) => {
    const filmeId = Number(req.params.filmeId)

    if (!Number.isInteger(filmeId) || filmeId <= 0) {
      return res.status(400).json({ erro: 'Filme inválido.' })
    }

    try {
      const filme = await this.filmeDAO.getById(filmeId)
      if (!filme) {
        return res.status(404).json({ erro: 'Filme não encontrado.' })
      }

      const favorito = await this.favoritoDAO.insert(req.usuario.id, filmeId)
      return res.status(201).json({
        mensagem: 'Filme adicionado aos favoritos.',
        favorito
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ erro: 'Erro ao adicionar filme aos favoritos.' })
    }
  }

  remover = async (req, res) => {
    const filmeId = Number(req.params.filmeId)

    if (!Number.isInteger(filmeId) || filmeId <= 0) {
      return res.status(400).json({ erro: 'Filme inválido.' })
    }

    try {
      await this.favoritoDAO.remove(req.usuario.id, filmeId)
      return res.json({ mensagem: 'Filme removido dos favoritos.' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ erro: 'Erro ao remover filme dos favoritos.' })
    }
  }
}
