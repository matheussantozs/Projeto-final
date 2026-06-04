import knex from 'knex'
import Usuario from '../models/Usuario.js'

const db = knex({
    client: 'sqlite3',
    connection: { filename: 'Usuario.db' },
    useNullAsDefault: true
})

export default class UsuarioDAO {

    static #privateConstructor = false
    constructor() {
        if (!UsuarioDAO.#privateConstructor)
            throw new Error("Use UsuarioDAO.build()")
    }

    static async build() {
        await UsuarioDAO.#createTable()

        UsuarioDAO.#privateConstructor = true   // abre o portão temporariamente
        const dao = new UsuarioDAO()             // agora o constructor deixa passar
        UsuarioDAO.#privateConstructor = false   // fecha o portão de volta
        return dao                             // entrega o DAO pronto para uso
    }

    static async #createTable() {
        const existe = await db.schema.hasTable('usuario')

        if (!existe) {
            await db.schema.createTable('usuario', (table) => {
                table.increments('id')
                table.string('email', 100)
                table.string('nome', 100)
                table.string('senha')
                table.string('acesso')
            })
        }
    }

    async insert(usuario) {

        await db('usuario').insert({
            email: usuario.email,   
            nome: usuario.nome,
            senha: usuario.senha,
            acesso: usuario.acesso

        })
    }

    async getAll() {
        const rows = await db('usuario').select('*')
        return rows.map(r => new Filme(r.email, r.nome, r.senha, r.acesso, r.id))
    }

    async getById(id) {
        const r = await db('usuario').where('id', id).first()

        if (r) return new Filme(r.email, r.nome, r.senha, r.acesso, r.id)

        return null
    }

    async update(usuario) {

        await db('usuario').where('id', usuario.id).update({

            email: usuario.email,
            nome: usuario.nome,
            senha: usuario.senha,
            acesso: usuario.acesso
        })
    }

    async delete(id) {
        await db('usuario').where('id', id).delete()
    }

    static async close() {
        await db.destroy()
    }
}