import Entidade from './Entidade.js'

export default class Filme extends Entidade {
  #ano
  #titulo
  #sinopse
  #diretor
  #genero
  #capaUrl

  constructor(id, ano, titulo, sinopse, diretor, genero, capaUrl = null) {
    super(id)
    this.#ano = Number(ano)
    this.#titulo = titulo
    this.#sinopse = sinopse
    this.#diretor = diretor
    this.#genero = genero
    this.#capaUrl = capaUrl
  }

  get ano() { return this.#ano }
  get titulo() { return this.#titulo }
  get sinopse() { return this.#sinopse }
  get diretor() { return this.#diretor }
  get genero() { return this.#genero }
  get capaUrl() { return this.#capaUrl }

  getResumo() {
    return `${this.#titulo} (${this.#ano}) - ${this.#genero}`
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ano: this.#ano,
      titulo: this.#titulo,
      sinopse: this.#sinopse,
      diretor: this.#diretor,
      genero: this.#genero,
      capaUrl: this.#capaUrl,
      resumo: this.getResumo()
    }
  }
}
