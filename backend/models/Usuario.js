export default class Usuario {
    #id
    #email
    #nome
    #senha
    #acesso

    constructor(id, email, nome, senha, acesso = 'COMUM') {
        this.#id    = id
        this.#email = email
        this.#nome  = nome
        this.#senha = senha
        this.#acesso = acesso
    }

    get id()     { return this.#id }
    get email()  { return this.#email }
    get nome()   { return this.#nome }
    get senha()  { return this.#senha }
    get acesso() { return this.#acesso }

    isAdmin() {
        return this.#acesso === 'ADMINISTRADOR'
    }
}