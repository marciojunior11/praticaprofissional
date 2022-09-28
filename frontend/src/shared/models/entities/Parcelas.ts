import FormasPagamento from "./FormasPagamento";
import PaiSemId from "./PaiSemId";

class Parcelas extends PaiSemId {
    // #region ATRIBUTOS
    private numero: number;
    private dias: number;
    private percentual: number;
    private formapagamento: FormasPagamento
    // #endregion

    // #region CONSTRUCTOR
    constructor(numero: number = 0, dias: number = 0, percentual: number = 0, formapagamento: FormasPagamento = new FormasPagamento(), datacad: string | Date = new Date(), ultalt: string | Date = new Date()) {
        super();
        this.numero = numero;
        this.dias = dias;
        this.percentual = percentual;
        this.formapagamento = formapagamento;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }
    // #endregion

    // #region GETTERS
    public get _numero() {
        return this.numero;
    }

    public get _dias() {
        return this.dias;
    }

    public get _percentual() {
        return this.percentual;
    }

    public get _formapagamento() {
        return this.formapagamento;
    }
    // #endregion

    // #region SETTERS
    public set _numero(value: number) {
        this.numero = value;
    }

    public set _dias(value: number) {
        this.dias = value;
    }

    public set _percentual(value: number) {
        this.percentual = value;
    }

    public set _formapagamento(value: FormasPagamento) {
        this.formapagamento = value;
    }
    // #endregion
}

export default Parcelas;