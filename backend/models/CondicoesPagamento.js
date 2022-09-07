const { Pai } = require("./Pai");

class CondicoesPagamento extends Pai {

    #id;
    #descricao;
    #txdesc;
    #txmulta;
    #txjuros;
    #listaparcelas;
    #flsituacao;

    constructor(id, descricao, txdesc, txmulta, txjuros, listaparcelas, flsituacao, datacad, ultalt) {
        if (arguments.length == 0) {
            super();
            this.#id = undefined;
            this.#descricao = "";
            this.#txdesc = 0.00;
            this.#txmulta = 0.00;
            this.#txjuros = 0.00;
            this.#listaparcelas = new Array();
            this.#flsituacao = "";
        } else {
            this.#id = id;
            this.#descricao = descricao;
            this.#txdesc = txdesc;
            this.#txmulta = txmulta;
            this.#txjuros = txjuros;
            this.#listaparcelas = listaparcelas;
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

    getDescricao = () => {
        return this.#descricao;
    };

    setTxDesc = (value) => {
        this.#txdesc = value;
    };

    getTxDesc = () => {
        return this.#txdesc;
    };

    setTxMulta = (value) => {
        this.#txmulta = value;
    };

    getTxMulta = () => {
        return this.#txmulta;
    };

    setTxJuros = (value) => {
        this.#txjuros = value;
    };

    getTxJuros = () => {
        return this.#txjuros;
    };

    setListaParcelas = (value) => {
        this.#listaparcelas = value;
    };

    getListaParcelas = () => {
        return this.#listaparcelas;
    }

    setFlSituacao = (value) => {
        this.#flsituacao = value;
    };

    getFlSituacao = () => {
        return this.#flsituacao;
    };

    getClone = () => {
        return new CondicoesPagamento(this.#id, this.#descricao, this.#txdesc, this.#txmulta, this.#txjuros, this.#listaparcelas, this.#flsituacao, this.getDataCad(), this.getUltAlt());
    };

};

module.exports = {
    CondicoesPagamento
};