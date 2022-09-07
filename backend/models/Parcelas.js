const { FormasPagamento } = require("./FormasPagamento");
const { Pai } = require("./Pai");

class Parcelas extends Pai {

    #numero;
    #dias;
    #percentual;
    #formapagamento;
    #flsituacao;

    constructor(numero, dias, percentual, formapagamento, flsituacao, datacad, ultalt) {
        super();
        if (arguments.length == 0) {
            this.#numero = undefined;
            this.#dias = undefined;
            this.#percentual = undefined;
            this.#formapagamento = new FormasPagamento(); 
            this.#flsituacao = "";
        } else {
            this.#numero = numero;
            this.#dias = dias;
            this.#percentual = percentual;
            this.#formapagamento = formapagamento;
            this.#flsituacao = flsituacao;
            this.setDataCad(datacad);
            this.setUltAlt(ultalt);
        };
    };

    setNumero = (value) => {
        this.#numero = value;
    };

    getNumero = () => {
        return this.#numero;
    };

    setDias = (value) => {
        this.#dias = value;
    };

    getDias = () => {
        return this.#dias;
    };

    setPercentual = (value) => {
        this.#percentual = value;
    };

    getPercentual = () => {
        return this.#percentual;
    };

    setFormaPagamento = (value) => {
        this.#formapagamento = value;
    };

    getFormaPagamento = () => {
        return this.#formapagamento;
    };

    setFlSituacao = (value) => {
        this.#flsituacao = value;
    };

    getFlSituacao = () => {
        return this.#flsituacao;
    };

    getClone = () => {
        return new Parcelas(this.#numero, this.#dias, this.#percentual, this.#formapagamento, this.#flsituacao, this.getDataCad(), this.getUltAlt());
    }
};

module.exports = {
    Parcelas
};