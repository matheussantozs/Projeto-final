import db from '../config/database.js'
import BaseDAO from './BaseDAO.js'
import Filme from '../models/Filme.js'

export default class FilmeDAO extends BaseDAO {
  constructor() {
    super(db, 'filme')
  }

  static async build() {
    await FilmeDAO.createTable()
    return new FilmeDAO()
  }

  static async createTable() {
    const existe = await db.schema.hasTable('filme')

    if (!existe) {
      await db.schema.createTable('filme', (table) => {
        table.increments('id').primary()
        table.string('titulo', 150).notNullable()
        table.integer('ano').notNullable()
        table.text('sinopse').notNullable()
        table.string('diretor', 100).notNullable()
        table.string('genero', 80).notNullable()
        table.string('capa_url', 500)
        table.timestamps(true, true)
      })
    }
  }

  #toModel(row) {
    return row
      ? new Filme(row.id, row.ano, row.titulo, row.sinopse, row.diretor, row.genero, row.capa_url)
      : null
  }

  async insert(filme) {
    const [id] = await this.db(this.tableName).insert({
      titulo: filme.titulo,
      ano: filme.ano,
      sinopse: filme.sinopse,
      diretor: filme.diretor,
      genero: filme.genero,
      capa_url: filme.capaUrl
    })
    return this.getById(id)
  }

  async getAll() {
    const rows = await this.db(this.tableName).select('*').orderBy('titulo')
    return rows.map(row => this.#toModel(row))
  }

  async getById(id) {
    const row = await this.db(this.tableName).where({ id }).first()
    return this.#toModel(row)
  }

  async update(filme) {
    await this.db(this.tableName).where({ id: filme.id }).update({
      titulo: filme.titulo,
      ano: filme.ano,
      sinopse: filme.sinopse,
      diretor: filme.diretor,
      genero: filme.genero,
      capa_url: filme.capaUrl,
      updated_at: this.db.fn.now()
    })
    return this.getById(filme.id)
  }
}
