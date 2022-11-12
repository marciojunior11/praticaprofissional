import { IContasPagar } from "../../interfaces/entities/ContasPagar";
import CentrosCusto from "./CentrosCusto";
import FormasPagamento from "./FormasPagamento";
import Juridicas from "./Juridicas";
import PaiSemId from "./PaiSemId";

class ContasPagar extends PaiSemId {
    // #region ATRIBUTOS
    private nrparcela: number;
    private dtvencimento: string | Date;
    private valor: number;
    private txdesc: number;
    private txmulta: number;
    private txjuros: number;
    private fornecedor: Juridicas;
    private formapagamento: FormasPagamento;
    private centrocusto: CentrosCusto;
    private flsituacao: string;
    // #endregion

    // #region CONSTRUCTOR
    constructor(
        nrparcela: number = 0,
        dtvencimento: string | Date = new Date(),
        valor: number = 0,
        txdesc: number = 0,
        txmulta: number = 0,
        txjuros: number = 0,
        fornecedor: Juridicas = new Juridicas(),
        formapagamento: FormasPagamento = new FormasPagamento(),
        centrocusto: CentrosCusto = new CentrosCusto(),
        flsituacao: string = "",
        datacad: string | Date = new Date(),
        ultalt: string | Date = new Date()
    ) {
        super();
        this.nrparcela = nrparcela;
        this.dtvencimento = dtvencimento;
        this.valor = valor;
        this.txdesc = txdesc;
        this.txmulta = txmulta;
        this.txjuros = txjuros;
        this.fornecedor = fornecedor;
        this.formapagamento = formapagamento;
        this.centrocusto = centrocusto;
        this.flsituacao = flsituacao;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }
    // #endregion

    // #region GETTERS
    public get _nrparcela() {
        return this.nrparcela;
    }

    public get _dtvencimento() {
        return this.dtvencimento;
    }

    public get _valor() {
        return this.valor;
    }

    public get _txdesc() {
        return this.txdesc;
    }

    public get _multa() {
        return this.txmulta;
    }

    public get _juros() {
        return this.txjuros;
    }

    public get _fornecedor() {
        return this.fornecedor;
    }

    public get _formapagamento() {
        return this.formapagamento;
    }

    public get _centrocusto() {
        return this.centrocusto;
    }

    public get _flsituacao() {
        return this.flsituacao;
    }
    // #endregion

    // #region SETTERS
    public set _nrparcela(value: number) {
        this.nrparcela = value;
    }

    public set _dtvencimento(value: string | Date) {
        this.dtvencimento = value;
    }

    public set _valor(value: number) {
        this.valor = value;
    }

    public set _txdesc(value: number) {
        this.txdesc = value;
    }

    public set _multa(value: number) {
        this._multa = value;
    }

    public set _juros(value: number) {
        this._juros = value;
    }

    public set _fornecedor(value: Juridicas) {
        this.fornecedor = value;
    }

    public set _formapagamento(value: FormasPagamento) {
        this.formapagamento = value;
    }

    public set _centrocusto(value: CentrosCusto) {
        this.centrocusto = value;
    }

    public set _flsituacao(value: string) {
        this.flsituacao = value;
    }
    // #endregion

    // #region METHODS

    // #endregion
}

export default ContasPagar;