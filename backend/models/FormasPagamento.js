const { Pai } = require("./Pai");

class FormasPagamento extends Pai {

    #id;
    #descricao;
    #flsituacao;

    constructor(id, descricao, flsituacao, datacad, ultalt) {
        super();
        if (arguments.length == 0) {
            this.#id = undefined;
            this.#descricao = "";
            this.#flsituacao = "";
        } else {
            this.#id = id;
            this.#descricao = descricao;
            this.#flsituacao = flsituacao;
            this.setDataCad(datacad);
            this.setUltAlt(ultalt);
        };
    };

    setId = (value) => {
        this.#id = value;
    };

    getId = () => {
        return this.#id;
    };

    setDescricao = (value) => {
        this.#descricao = value;
    };

    setDescricao = () => {
        return this.#descricao;
    };

    setFlSituacao = (value) => {
        this.#flsituacao = value;
    };

    getFlSituacao = () => {
        return this.#flsituacao;
    };

    getClone = () => {
        return new FormasPagamento(this.#id, this.#descricao, this.#flsituacao, this.getDataCad(), this.getUltAlt());
    };

};

module.exports = {
    FormasPagamento
}