import { IContasPagar } from "../../interfaces/entities/ContasPagar";
import CentrosCusto from "./CentrosCusto";
import FormasPagamento from "./FormasPagamento";
import Juridicas from "./Juridicas";
import PaiSemId from "./PaiSemId";

class ContasPagar extends PaiSemId {
    // #region ATRIBUTOS
    private nrparcela: number;
    private percparcela: number;
    private dtvencimento: string | Date;
    private vltotal: number;
    private txdesc: number;
    private txmulta: number;
    private txjuros: number;
    private observacao: string;
    private fornecedor: Juridicas;
    private formapagamento: FormasPagamento;
    private flcentrocusto: string;
    private flsituacao: string;
    // #endregion

    // #region CONSTRUCTOR
    constructor(
        nrparcela: number = 0,
        percparcela: number = 0,
        dtvencimento: string | Date = new Date(),
        vltotal: number = 0,
        txdesc: number = 0,
        txmulta: number = 0,
        txjuros: number = 0,
        observacao: string = "",
        fornecedor: Juridicas = new Juridicas(),
        formapagamento: FormasPagamento = new FormasPagamento(),
        flcentrocusto: string = "",
        flsituacao: string = "",
        datacad: string | Date = new Date(),
        ultalt: string | Date = new Date()
    ) {
        super();
        this.nrparcela = nrparcela;
        this.percparcela = percparcela;
        this.dtvencimento = dtvencimento;
        this.vltotal = vltotal;
        this.txdesc = txdesc;
        this.txmulta = txmulta;
        this.txjuros = txjuros;
        this.observacao = observacao;
        this.fornecedor = fornecedor;
        this.formapagamento = formapagamento;
        this.flcentrocusto = flcentrocusto;
        this.flsituacao = flsituacao;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }
    // #endregion

    // #region GETTERS
    public get _nrparcela() {
        return this.nrparcela;
    }

    public get _percparcela() {
        return this.percparcela;
    }

    public get _dtvencimento() {
        return this.dtvencimento;
    }

    public get _vltotal() {
        return this.vltotal;
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

    public get _observacao() {
        return this.observacao;
    }

    public get _fornecedor() {
        return this.fornecedor;
    }

    public get _formapagamento() {
        return this.formapagamento;
    }

    public get _centrocusto() {
        return this.flcentrocusto;
    }

    public get _flsituacao() {
        return this.flsituacao;
    }
    // #endregion

    // #region SETTERS
    public set _nrparcela(value: number) {
        this.nrparcela = value;
    }

    public set _percparcela(value: number) {
        this.percparcela = value;
    }

    public set _dtvencimento(value: string | Date) {
        this.dtvencimento = value;
    }

    public set _vltotal(value: number) {
        this.vltotal = value;
    }

    public set _txdesc(value: number) {
        this.txdesc = value;
    }

    public set _txmulta(value: number) {
        this.txmulta = value;
    }

    public set _txjuros(value: number) {
        this.txjuros = value;
    }

    public set _observacao(value: string) {
        this.observacao = value;
    }

    public set _fornecedor(value: Juridicas) {
        this.fornecedor = value;
    }

    public set _formapagamento(value: FormasPagamento) {
        this.formapagamento = value;
    }

    public set _centrocusto(value: string) {
        this.flcentrocusto = value;
    }

    public set _flsituacao(value: string) {
        this.flsituacao = value;
    }
    // #endregion

    // #region METHODS

    // #endregion
}

export default ContasPagar;