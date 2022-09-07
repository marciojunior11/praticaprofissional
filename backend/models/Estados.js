const { Pai } = require("./Pai");
const { Paises } = require("./Paises");

class Estados extends Pai {

    #id;
    #nmestado;
    #uf;
    #pais;
    #flsituacao;

    constructor(id, nmestado, uf, pais, flsituacao, datacad, ultalt) {
        super();
        if (arguments.length == 0) {
            this.#id = undefined;
            this.#nmestado = "";
            this.#uf = "";
            this.#pais = new Paises();
            this.#flsituacao = "";
        } else {
            this.#id = id;
            this.#nmestado = nmestado;
            this.#uf = uf;
            this.#pais = pais;
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

    setNmEstado = (value) => {
        this.#nmestado = value;
    };

    getNmEstado = () => {
        return this.#nmestado;
    };

    setUF = (value) => {
        this.#uf = value;
    };

    getUF = () => {
        return this.#uf;
    };

    setPais = (value) => {
        this.#pais = value;
    };

    getPais = () => {
        return this.#pais;
    };

    setFlSituacao = (value) => {
        this.#flsituacao = value;
    };

    getFlSituacao = () => {
        return this.#flsituacao;
    };

    getClone = () => {
        return new Estados(this.#id, this.#nmestado, this.#uf, this.#pais, this.#flsituacao, this.getDataCad(), this.getUltAlt());
    };
    
};

module.exports = {
    Estados
};