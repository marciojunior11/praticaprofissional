abstract class PaiComId {
    //ATRIBUTOS
    protected id: number;
    protected datacad: Date | string;
    protected ultalt: Date | string;

    //CONSTRUCTORS
    constructor() {
        this.id = 0;
        this.datacad = new Date();
        this.ultalt = new Date();
    }

    //GETTERS
    public get _id() {
        return this.id;
    }

    public get _datacad() {
        return this.datacad;
    }

    public get _ultalt() {
        return this.ultalt;
    }

    //SETTERS
    public set _id(value: number) {
        this.id = value;
    }

    public set _datacad(value: Date | string) {
        this.datacad = value;
    }

    public set _ultalt(value: Date | string) {
        this.ultalt = value;
    }
}

export default PaiComId;