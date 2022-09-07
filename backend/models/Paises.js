const { Pai } = require("./Pai");

class Paises extends Pai {

    #id;
    #nmpais;
    #sigla;
    #ddi;
    #flsituacao;

    constructor(id, nmpais, sigla, ddi, flsituacao, datacad, ultalt) {
        super();
        if (arguments.length == 0) {
            this.#id = undefined;
            this.#nmpais = "";
            this.#sigla = "";
            this.#ddi = "";
            this.#flsituacao = "";
        } else {
            this.#id = id;
            this.#nmpais = nmpais;
            this.#sigla = sigla;
            this.#ddi = ddi;
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

    setNmPais = (value) => {
        this.#nmpais = value;
    };

    getNmPais = () => {
        return this.#nmpais;
    };

    setSigla = (value) => {
        this.#sigla = value;
    };

    getSigla = () => {
        return this.#sigla;
    };

    setDDI = (value) => {
        this.#ddi = value;
    };

    getDDI = () => {
        return this.#ddi;
    };

    setFlSituacao = (value) => {
        this.#flsituacao = value;
    };

    getFlSituacao = () => {
        return this.#flsituacao;
    };

    getClone = () => {
        return new Paises(this.#id, this.#nmpais, this.#sigla, this.#ddi, this.#flsituacao, this.getDataCad(), this.getUltAlt());
    };
};

module.exports = {
    Paises
};