import PaiComId from "./PaiComId";

class FormasPagamento extends PaiComId {
    // #region ATRIBUTOS
    private descricao: string;
    // #endregion

    // #region CONSTRUCTOR
    constructor(id: number = 0, descricao: string = "", datacad: string | Date = new Date(), ultalt: string | Date = new Date()) {
        super();
        this.id = id;
        this.descricao = descricao;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }
    // #endregion

    // #region GETTERS
    public get _descricao() {
        return this.descricao;
    }
    // #endregion

    // #region SETTERS
    public set _descricao(value: string) {
        this.descricao = value;
    }
    // #endregion
}

export default FormasPagamento;