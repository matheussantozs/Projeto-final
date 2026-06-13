import Pessoa from './Pessoa.js'

export default class Usuario extends Pessoa {
  #senha
  #acesso

  constructor(id, email, nome, senha, acesso = 'COMUM') {
    super(id, nome, email)
    this.#senha = senha
    this.#acesso = acesso || 'COMUM'
  }

  get senha() {
    return this.#senha
  }

  get acesso() {
    return this.#acesso
  }

  isAdmin() {
    return this.#acesso === 'ADMINISTRADOR'
  }

  toJSON() {
    return {
      ...super.toJSON(),
      acesso: this.#acesso
    }
  }
}
