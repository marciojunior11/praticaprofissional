import FormasPagamento from "./FormasPagamento";
import Fisicas from "./Fisicas";
import CondicoesPagamento from "./CondicoesPagamento";
import PaiComId from "./PaiComId";
import ContasReceber from "./ContasReceber";
import Vendas from "./Vendas";

class Contratos extends PaiComId {
    // #region ATRIBUTOS
    private cliente: Fisicas;
    private condicaopagamento: CondicoesPagamento;
    private venda: Vendas;
    private listacontasreceber: ContasReceber[];
    private qtdmeses: number;
    private vltotal: number;
    private datavalidade: string | Date;
    private flsituacao: string;
    // #endregion

    // #region CONSTRUCTOR
    constructor(
        id: number = 0,
        cliente: Fisicas = new Fisicas(),
        condicaopagamento: CondicoesPagamento = new CondicoesPagamento(),
        venda: Vendas = new Vendas(),
        listacontasreceber: ContasReceber[] = [],
        qtdmeses: number = 0,
        vltotal: number = 0,
        datavalidade: string | Date = new Date(),
        flsituacao: string = '',
        datacad: string | Date = new Date(),
        ultalt: string | Date = new Date()
    ) {
        super();
        this.id = id;
        this.cliente = cliente;
        this.condicaopagamento = condicaopagamento;
        this.venda = venda;
        this.listacontasreceber = listacontasreceber;
        this.qtdmeses = qtdmeses;
        this.vltotal = vltotal;
        this.datavalidade = datavalidade;
        this.flsituacao = flsituacao;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }
    // #endregion

    // #region GETTERS
    public get _cliente() {
        return this.cliente;
    }

    public get _condicaopagamento() {
        return this.condicaopagamento;
    }

    public get _venda() {
        return this.venda;
    }

    public get _listacontasreceber() {
        return this.listacontasreceber;
    }

    public get _qtdmeses() {
        return this.qtdmeses;
    }

    public get _vltotal() {
        return this.vltotal;
    }

    public get _datavalidade() {
        return this.datavalidade;
    }

    public get _flsituacao() {
        return this.flsituacao;
    }
    // #endregion

    // #region SETTERS
    public set _cliente(value: Fisicas) {
        this.cliente = value;
    }

    public set _condicaopagamento(value: CondicoesPagamento) {
        this.condicaopagamento = value;
    }

    public set _venda(value: Vendas) {
        this.venda = value;
    }

    public set _listacontasreceber(value: ContasReceber[]) {
        this.listacontasreceber = value;
    }

    public set _qtdmeses(value: number) {
        this.qtdmeses = value;
    }

    public set _vltotal(value: number) {
        this.vltotal = value;
    }

    public set _datavalidade(value: string | Date) {
        this.datavalidade = value;
    }

    public set _flsituacao(value: string) {
        this.flsituacao = value;
    }
    // #endregion

    // #region METHODS

    // #endregion
}

export default Contratos;