export default class Usuario {
    #id
    #email
    #nome
    #senha
    #acesso

    constructor(id, email, nome, senha, acesso = 'COMUM') {
        this.#id = id
        this.#email = email
        this.#nome = nome
        this.#senha = senha
        this.#acesso = acesso
    }

    isAdmin() {
        return this.#acesso === "ADM"
    }
}