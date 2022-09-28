import PaiComId from "./PaiComId";
import Paises from "./Paises";

class Estados extends PaiComId {
    // #region ATRIBUTOS
    private nmestado: string;
    private uf: string;
    private pais: Paises;
    // #endregion

    // #region CONSTRUCTOR
    constructor(id: number = 0, nmestado: string = "", uf: string = "", pais: Paises = new Paises(), datacad: Date | string = new Date(), ultalt: Date | string = new Date()) {
        super();
        this.id = id;
        this.nmestado = nmestado;
        this.uf = uf;
        this.pais = pais;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }
    // #endregion

    // #region GETTERS
    public get _nmestado() {
        return this.nmestado;
    }

    public get _uf() {
        return this.uf;
    }

    public get _pais() {
        return this.pais;
    }
    // #endregion

    // #region SETTERS
    public set _nmestado(value: string) {
        this.nmestado = value;
    }

    public set _uf(value: string) {
        this.uf = value;
    }

    public set _pais(value: Paises) {
        this.pais = value;
    }
    // #endregion
}

export default Estados;