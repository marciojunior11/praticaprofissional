const { Estados } = require("./Estados");
const { Pai } = require("./Pai");

class Cidades extends Pai {

    #id;
    #nmcidade;
    #ddd;
    #estado;
    #flsituacao;

    constructor(id, nmcidade, ddd, estado, flsituacao, datacad, ultalt) {
        super();
        if (arguments.length == 0) {
            this.#id = undefined;
            this.#nmcidade = "",
            this.#ddd = "";
            this.#estado = new Estados();
            this.#flsituacao = "";
        } else {
            this.#id = id;
            this.#nmcidade = nmcidade,
            this.#ddd = ddd;
            this.#estado = estado;
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

    setNmCidade = (value) => {
        this.#nmcidade = value;
    };

    getNmCidade = () => {
        return this.#nmcidade;
    };

    setDDD = (value) => {
        this.#ddd = value;
    };

    getDDD = () => {
        return this.#ddd;
    };

    setEstado = (value) => {
        this.#estado = value;
    };

    getEstado = () => {
        return this.#estado;
    };

    setFlSituacao = (value) => {
        this.#flsituacao = value;
    };

    getFlSituacao = () => {
        return this.#flsituacao;
    };

    getClone = () => {
        return new Cidades(this.#id, this.#nmcidade, this.#ddd, this.#estado, this.#flsituacao, this.getDataCad(), this.getUltAlt());
    };
};

module.exports = {
    Cidades
};