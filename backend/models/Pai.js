class Pai {

    #datacad;
    #ultalt;

    constructor() {
        this.#datacad = new Date();
        this.#ultalt = new Date();
    };

    setDataCad = (value) => {
        this.#datacad = value;
    };

    getDataCad = () => {
        return this.#datacad;
    };

    setUltAlt = (value) => {
        this.#ultalt = value;
    };

    getUltAlt = () => {
        return this.#ultalt;
    };
};

module.exports = {
    Pai
};
