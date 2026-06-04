export default class Filme {
    #id
    #ano
    #titulo
    #sinopse
    #diretor
    #genero
    #capaurl
    

    constructor(id, ano, titulo, sinopse, diretor, genero, capaurl) {
        this.#id = id
        this.#ano = ano
        this.#titulo = titulo
        this.#sinopse = sinopse
        this.#diretor = diretor
        this.#genero = genero
        this.#capaurl = capaurl
    }

    get id() {
        return this.#id
    }

    get ano() {
        return this.#ano
    }

    get titulo() {
        return this.#titulo
    }

    get sinopse() {
        return this.#sinopse
    }

    get diretor() {
        return this.#diretor
    }

    get genero() {
        return this.#genero
    }

    get capaurl() {
        return this.#capaurl
    }

}