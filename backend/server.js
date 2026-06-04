import express from 'express'
const app = express()
const PORT = 3000

//======================= SERVIDOR =============================
//app.get('/', (req, res) => {
//    res.send('Servidor OK')
//})

//app.listen(PORT, () => {
//  console.log(`Servidor rodando em http://localhost:${PORT}`);
//});
//======================= SERVIDOR =============================


//==============================  TESTE DO USUARIO DAO   ========================================
import Usuario from './models/Usuario.js'
import UsuarioDAO from './daos/UsuarioDAO.js'

import promptSync from 'prompt-sync'
const prompt = promptSync()
const dao = await UsuarioDAO.build()

async function inserUser() {
    const email = prompt('Email: ')
    const nome = prompt('Nome: ')
    const senha    = prompt('senha: ')
    const acesso   = prompt('acesso: ')

  await dao.insert(new Usuario(null, email, nome, senha, acesso))
    console.log('Usuário cadastrado')
}

await inserUser()
//==============================  TESTE DO USUARIO DAO   ========================================


//==============================  TESTE DA CLASSE FILMES   ========================================
//import Filme from './models/Filme.js'
//const f1 = new Filme(1, 2006, "Vingadores", "Super herois fortes", "Irmão sla", "Ficção", "https:/slaaaa")
//console.log(f1.titulo)
//==============================  TESTE DA CLASSE FILMES   ========================================