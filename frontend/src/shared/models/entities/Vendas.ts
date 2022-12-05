import PaiSemId from "./PaiSemId";
import Fisicas from "./Fisicas";
import Produtos from "./Produtos";
import ContasReceber from "./ContasReceber";
import CondicoesPagamento from "./CondicoesPagamento";

class Vendas extends PaiSemId {
    // #region ATRIBUTOS
    private id: number;
    private cliente: Fisicas;
    private observacao: string;
    private condicaopagamento: CondicoesPagamento;
    private vltotal: number;
    private listaprodutos: Produtos[];
    private listacontasreceber: ContasReceber[];
    private flsituacao: string;
    private dataemissao: string | Date;
    // #endregion

    // #region CONSTRUCTOR
    constructor(
        id: number,
        cliente: Fisicas = new Fisicas(),
        condicaopagamento: CondicoesPagamento = new CondicoesPagamento(),
        observacao: string = "",
        vltotal: number = 0,
        listaprodutos: Produtos[] = [],
        listacontasreceber: ContasReceber[] = [],
        flsituacao: string = "",
        dataemissao: string | Date = new Date(),
        datacad: string | Date = new Date(),
        ultalt: string | Date = new Date()
    ) {
        super();
        this.id = id;
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
    public get _id() {
        return this.id;
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
    public set _id(value: number) {
        this.id = value;
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