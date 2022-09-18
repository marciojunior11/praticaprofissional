abstract class PaiSemId {
    //ATRIBUTOS
    protected datacad: Date | string;
    protected ultalt: Date | string;

    //CONSTRUCTORS
    constructor() {
        this.datacad = new Date();
        this.ultalt = new Date();
    }

    //GETTERS

    public get _datacad() {
        return this.datacad;
    }

    public get _ultalt() {
        return this.ultalt;
    }

    //SETTERS

    public set _datacad(value: Date | string) {
        this.datacad = value;
    }

    public set _ultalt(value: Date | string) {
        this.ultalt = value;
    }
}

export default PaiSemId;