import PaiSemId from "./PaiSemId";
import Fisicas from "./Fisicas";
import Produtos from "./Produtos";
import ContasReceber from "./ContasReceber";
import CondicoesPagamento from "./CondicoesPagamento";

class Vendas extends PaiSemId {
    // #region ATRIBUTOS
    private numnf: string;
    private serienf: string;
    private cliente: Fisicas;
    private condicaopagamento: CondicoesPagamento;
    private observacao: string;
    private vltotal: number;
    private listaprodutos: Produtos[];
    private listacontasreceber: ContasReceber[];
    private flsituacao: string;
    private dataemissao: string | Date;
    // #endregion

    // #region CONSTRUCTOR
    constructor(
        numnf: string = "",
        serienf: string = "",
        modelonf: string = "",
        cliente: Fisicas = new Fisicas(),
        condicaopagamento: CondicoesPagamento = new CondicoesPagamento(),
        observacao: string = "",
        vlfrete: number = 0,
        vlpedagio: number = 0,
        vloutrasdespesas = 0,
        vltotal: number = 0,
        listaprodutos: Produtos[] = [],
        listacontasreceber: ContasReceber[] = [],
        flsituacao: string = "",
        dataemissao: string | Date = new Date(),
        dataentrada: string | Date = new Date(),
        datacad: string | Date = new Date(),
        ultalt: string | Date = new Date()
    ) {
        super();
        this.numnf = numnf;
        this.serienf = serienf;
        this.cliente = cliente;
        this.condicaopagamento = condicaopagamento;
        this.observacao = observacao;
        this.vltotal = vltotal;
        this.listaprodutos = listaprodutos;
        this.listacontasreceber = listacontasreceber;
        this.flsituacao = flsituacao;
        this.dataemissao = dataemissao;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }
    // #endregion

    // #region GETTERS
    public get _numnf() {
        return this.numnf;
    }

    public get _serienf() {
        return this.serienf;
    }

    public get _cliente() {
        return this.cliente;
    }

    public get _condicaopagamento() {
        return this.condicaopagamento;
    }

    public get _observacao() {
        return this.observacao;
    }

    public get _vltotal() {
        return this.vltotal;
    }

    public get _listaprodutos() {
        return this.listaprodutos;
    }

    public get _listacontasreceber() {
        return this.listacontasreceber;
    }

    public get _flsituacao() {
        return this.flsituacao;
    }

    public get _dataemissao() {
        return this.dataemissao;
    }
    // #endregion

    // #region SETTERS
    public set _numnf(value: string) {
        this.numnf = value;
    }

    public set _serienf(value: string) {
        this.serienf = value;
    }

    public set _cliente(value: Fisicas) {
        this.cliente = value;
    }

    public set _condicaopagamento(value: CondicoesPagamento) {
        this.condicaopagamento = value;
    }

    public set _observacao(value: string) {
        this.observacao = value;
    }

    public set _vltotal(value: number) {
        this.vltotal = value;
    }

    public set _listaprodutos(value: Produtos[]) {
        this.listaprodutos = value;
    }

    public set _listacontasreceber(value: ContasReceber[]) {
        this.listacontasreceber = value;
    }

    public set _flsituacao(value: string) {
        this.flsituacao = value;
    }

    public set _dataemissao(value: string | Date) {
        this.dataemissao = value;
    }
    // #endregion

    // #region METHODS

    // #endregion
}

export default Vendas;