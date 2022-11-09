import PaiComId from "./PaiComId";

class CentrosCusto extends PaiComId {
    //ATRIBUTOS
    private descricao: string;

    //CONSTRUCTOR
    constructor(id: number = 0, descricao: string = "", datacad: Date | string = new Date(), ultalt: Date | string = new Date()) {
        super();
        this.id = id;
        this.descricao = descricao;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }

    //GETTERS
    public get _descricao() {
        return this.descricao;
    }


    //SETTERS
    public set _descricao(value: string) {
        this.descricao = value;
    }
}

export default CentrosCusto;