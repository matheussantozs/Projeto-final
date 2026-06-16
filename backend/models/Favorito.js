import Entidade from './Entidade.js'

export default class Favorito extends Entidade {
  #usuarioId
  #filmeId
  #criadoEm

  constructor(id, usuarioId, filmeId, criadoEm = null) {
    super(id)
    this.#usuarioId = Number(usuarioId)
    this.#filmeId = Number(filmeId)
    this.#criadoEm = criadoEm
  }

  get usuarioId() {
    return this.#usuarioId
  }

  get filmeId() {
    return this.#filmeId
  }

  get criadoEm() {
    return this.#criadoEm
  }

  toJSON() {
    return {
      ...super.toJSON(),
      usuarioId: this.#usuarioId,
      filmeId: this.#filmeId,
      criadoEm: this.#criadoEm
    }
  }
}
