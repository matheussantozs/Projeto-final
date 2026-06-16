import db from '../config/database.js'
import BaseDAO from './BaseDAO.js'
import Favorito from '../models/Favorito.js'
import Filme from '../models/Filme.js'

export default class FavoritoDAO extends BaseDAO {
  constructor() {
    super(db, 'favorito')
  }

  static async build() {
    await FavoritoDAO.createTable()
    return new FavoritoDAO()
  }

  static async createTable() {
    const existe = await db.schema.hasTable('favorito')

    if (!existe) {
      await db.schema.createTable('favorito', (table) => {
        table.increments('id').primary()
        table.integer('usuario_id').unsigned().notNullable()
          .references('id').inTable('usuario').onDelete('CASCADE')
        table.integer('filme_id').unsigned().notNullable()
          .references('id').inTable('filme').onDelete('CASCADE')
        table.timestamp('created_at').notNullable().defaultTo(db.fn.now())
        table.unique(['usuario_id', 'filme_id'])
      })
    }
  }

  #toModel(row) {
    return row
      ? new Favorito(row.id, row.usuario_id, row.filme_id, row.created_at)
      : null
  }

  #toFilme(row) {
    return row
      ? new Filme(row.id, row.ano, row.titulo, row.sinopse, row.diretor, row.genero, row.capa_url)
      : null
  }

  async getByUsuarioAndFilme(usuarioId, filmeId) {
    const row = await this.db(this.tableName)
      .where({ usuario_id: usuarioId, filme_id: filmeId })
      .first()

    return this.#toModel(row)
  }

  async insert(usuarioId, filmeId) {
    const existente = await this.getByUsuarioAndFilme(usuarioId, filmeId)
    if (existente) return existente

    const [id] = await this.db(this.tableName).insert({
      usuario_id: usuarioId,
      filme_id: filmeId
    })

    const row = await this.db(this.tableName).where({ id }).first()
    return this.#toModel(row)
  }

  async getFilmesByUsuario(usuarioId) {
    const rows = await this.db(`${this.tableName} as favorito`)
      .join('filme', 'filme.id', 'favorito.filme_id')
      .where('favorito.usuario_id', usuarioId)
      .select('filme.*')
      .orderBy('favorito.created_at', 'desc')

    return rows.map(row => this.#toFilme(row))
  }

  async remove(usuarioId, filmeId) {
    return this.db(this.tableName)
      .where({ usuario_id: usuarioId, filme_id: filmeId })
      .delete()
  }
}
