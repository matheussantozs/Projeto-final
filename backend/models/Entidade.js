export default class Entidade {
  #id

  constructor(id = null) {
    this.#id = id
  }

  get id() {
    return this.#id
  }

  toJSON() {
    return { id: this.#id }
  }
}
