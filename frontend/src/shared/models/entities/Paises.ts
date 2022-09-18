import PaiComId from "./PaiComId";

class Paises extends PaiComId {
    //ATRIBUTOS
    private nmpais: string;
    private sigla: string;
    private ddi: string;

    //CONSTRUCTORS
    constructor(id: number = 0, nmpais: string = "", sigla: string = "", ddi: string = "", datacad: Date | string = new Date(), ultalt: Date | string = new Date()) {
        super();
        this._id = id;
        this.nmpais = nmpais;
        this.sigla = sigla;
        this.ddi = ddi;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }

    //GETTERS
    public get _nmpais() {
        return this.nmpais;
    }

    public get _sigla() {
        return this.sigla;
    }

    public get _ddi() {
        return this.ddi;
    }

    //SETTERS
    public set _nmpais(value: string) {
        this.nmpais = value;
    }

    public set _sigla(value: string) {
        this.nmpais = value;
    }

    public set _ddi(value: string) {
        this.ddi = value;
    }
}

export default Paises;