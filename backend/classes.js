class filme {
    #nome
    #diretor
    #ano
    #nota
    #descricao

    constructor(nome, diretor, ano, nota, descricao) {
        this.nome = nome
        this.diretor = diretor
        this.ano = ano
        this.nota = nota
        this.descricao = descricao
    }

    get nome() {
        return this.#nome
    }

    get diretor() {
        return this.#diretor
    }

    get ano (){
        return this.#ano
    }

    get nota(){
        return this.#nota
    }

    get descricao(){
        return this.#descricao
    }
}




