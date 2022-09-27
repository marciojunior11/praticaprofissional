import PaiComId from "./PaiComId";
import Estados from "./Estados";

class Cidades extends PaiComId {
    //ATRIBUTOS
    private nmcidade: string;
    private ddd: string;
    private estado: Estados;

    //CONSTRUCTOR
    constructor(id: number = 0, nmcidade: string = "", ddd: string = "", estado: Estados = new Estados(), datacad: Date | string = new Date(), ultalt: Date | string = new Date()) {
        super();
        this.id = id;
        this.nmcidade = nmcidade;
        this.ddd = ddd;
        this.estado = estado;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }

    //GETTERS
    public get _nmcidade() {
        return this.nmcidade;
    }

    public get _ddi() {
        return this.ddd;
    }

    public get _estado() {
        return this.estado;
    }

    //SETTERS
    public set _nmcidade(value: string) {
        this.nmcidade = value;
    }

    public set _ddd(value: string) {
        this.ddd = value;
    }

    public set _estado(value: Estados) {
        this.estado = value;
    }
}

export default Cidades;