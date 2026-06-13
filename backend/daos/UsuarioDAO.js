import db from '../config/database.js'
import BaseDAO from './BaseDAO.js'
import Usuario from '../models/Usuario.js'

export default class UsuarioDAO extends BaseDAO {
  constructor() {
    super(db, 'usuario')
  }

  static async build() {
    await UsuarioDAO.createTable()
    return new UsuarioDAO()
  }

  static async createTable() {
    const existe = await db.schema.hasTable('usuario')

    if (!existe) {
      await db.schema.createTable('usuario', (table) => {
        table.increments('id').primary()
        table.string('email', 100).notNullable().unique()
        table.string('nome', 100).notNullable()
        table.string('senha', 255).notNullable()
        table.string('acesso', 30).notNullable().defaultTo('COMUM')
      })
    }
  }

  #toModel(row) {
    return row ? new Usuario(row.id, row.email, row.nome, row.senha, row.acesso) : null
  }

  async insert(usuario) {
    const [id] = await this.db(this.tableName).insert({
      email: usuario.email,
      nome: usuario.nome,
      senha: usuario.senha,
      acesso: usuario.acesso
    })
    return this.getById(id)
  }

  async getByEmail(email) {
    const row = await this.db(this.tableName).where({ email }).first()
    return this.#toModel(row)
  }

  async getById(id) {
    const row = await this.db(this.tableName).where({ id }).first()
    return this.#toModel(row)
  }

  async getAll() {
    const rows = await this.db(this.tableName).select('*').orderBy('nome')
    return rows.map(row => this.#toModel(row))
  }

  async update(usuario) {
    await this.db(this.tableName).where({ id: usuario.id }).update({
      email: usuario.email,
      nome: usuario.nome,
      senha: usuario.senha,
      acesso: usuario.acesso
    })
    return this.getById(usuario.id)
  }

  async updatePassword(id, senhaHash) {
    await this.db(this.tableName).where({ id }).update({ senha: senhaHash })
  }
}
