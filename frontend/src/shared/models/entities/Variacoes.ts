import PaiComId from "./PaiComId";
import Caracteristicas from "./Caracteristicas";

class Variacoes extends PaiComId {
    //ATRIBUTOS
    private descricao: string;
    private caracteristica: Caracteristicas;

    //CONSTRUCTOR
    constructor(id: number = 0, descricao: string = "", caracteristica: Caracteristicas = new Caracteristicas(), datacad: Date | string = new Date(), ultalt: Date | string = new Date()) {
        super();
        this.id = id;
        this.descricao = descricao;
        this.caracteristica = caracteristica;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }

    //GETTERS
    public get _descricao() {
        return this.descricao;
    }

    public get _caracteristica() {
        return this.caracteristica;
    }

    //SETTERS
    public set _descricao(value: string) {
        this.descricao = value;
    }

    public set _caracteristica(value: Caracteristicas) {
        this.caracteristica = value;
    }
}

export default Variacoes;