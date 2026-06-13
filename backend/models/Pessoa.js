import Entidade from './Entidade.js'

export default class Pessoa extends Entidade {
  #nome
  #email

  constructor(id, nome, email) {
    super(id)
    this.#nome = nome
    this.#email = email
  }

  get nome() {
    return this.#nome
  }

  get email() {
    return this.#email
  }

  toJSON() {
    return {
      ...super.toJSON(),
      nome: this.#nome,
      email: this.#email
    }
  }
}
