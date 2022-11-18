import PaiSemId from "./PaiSemId";
import Juridicas from './Juridicas'
import Produtos from "./Produtos";
import ContasPagar from "./ContasPagar";
import CondicoesPagamento from "./CondicoesPagamento";

class Compras extends PaiSemId {
    // #region ATRIBUTOS
    private numnf: string;
    private serienf: string;
    private modelonf: string;
    private fornecedor: Juridicas;
    private condicaopagamento: CondicoesPagamento;
    private observacao: string;
    private vltotal: number;
    private vlfrete: number;
    private vlpedagio: number;
    private vloutrasdespesas: number;
    private listaprodutos: Produtos[];
    private listacontaspagar: ContasPagar[];
    private flsituacao: string;
    private dataemissao: string | Date;
    private dataentrada: string | Date;
    // #endregion

    // #region CONSTRUCTOR
    constructor(
        numnf: string = "",
        serienf: string = "",
        modelonf: string = "",
        fornecedor: Juridicas = new Juridicas(),
        condicaopagamento: CondicoesPagamento = new CondicoesPagamento(),
        observacao: string = "",
        vlfrete: number = 0,
        vlpedagio: number = 0,
        vloutrasdespesas = 0,
        vltotal: number = 0,
        listaprodutos: Produtos[] = [],
        listacontaspagar: ContasPagar[] = [],
        flsituacao: string = "",
        dataemissao: string | Date = new Date(),
        dataentrada: string | Date = new Date(),
        datacad: string | Date = new Date(),
        ultalt: string | Date = new Date()
    ) {
        super();
        this.numnf = numnf;
        this.serienf = serienf;
        this.modelonf = modelonf;
        this.fornecedor = fornecedor;
        this.condicaopagamento = condicaopagamento;
        this.observacao = observacao;
        this.vlfrete = vlfrete;
        this.vlpedagio = vlpedagio;
        this.vloutrasdespesas = vloutrasdespesas;
        this.vltotal = vltotal;
        this.listaprodutos = listaprodutos;
        this.listacontaspagar = listacontaspagar;
        this.flsituacao = flsituacao;
        this.dataemissao = dataemissao;
        this.dataentrada = dataentrada;
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

    public get _modelonf() {
        return this.modelonf;
    }

    public get _fornecedor() {
        return this.fornecedor;
    }

    public get _condicaopagamento() {
        return this.condicaopagamento;
    }

    public get _observacao() {
        return this.observacao;
    }

    public get _vlfrete() {
        return this.vlfrete;
    }
    
    public get _vlpedagio() {
        return this.vlpedagio;
    }

    public get _vloutrasdespesas() {
        return this.vloutrasdespesas;
    }

    public get _vltotal() {
        return this.vltotal;
    }

    public get _listaprodutos() {
        return this.listaprodutos;
    }

    public get _listacontaspagar() {
        return this.listacontaspagar;
    }

    public get _flsituacao() {
        return this.flsituacao;
    }

    public get _dataemissao() {
        return this.dataemissao;
    }

    public get _dataentrada() {
        return this.dataentrada;
    }

    // #endregion

    // #region SETTERS
    public set _numnf(value: string) {
        this.numnf = value;
    }

    public set _serienf(value: string) {
        this.serienf = value;
    }

    public set _modelonf(value: string) {
        this.modelonf = value;
    }

    public set _fornecedor(value: Juridicas) {
        this.fornecedor = value;
    }

    public set _condicaopagamento(value: CondicoesPagamento) {
        this.condicaopagamento = value;
    }

    public set _observacao(value: string) {
        this.observacao = value;
    }

    public set _vlfrete(value: number) {
        this.vlfrete = value;
    }

    public set _vlpegadio(value: number) {
        this.vlpedagio = value;
    }

    public set _vloutrasdespesas(value: number) {
        this.vloutrasdespesas = value;
    }

    public set _vltotal(value: number) {
        this.vltotal = value;
    }

    public set _listaprodutos(value: Produtos[]) {
        this.listaprodutos = value;
    }

    public set _listacontaspagar(value: ContasPagar[]) {
        this.listacontaspagar = value;
    }

    public set _flsituacao(value: string) {
        this.flsituacao = value;
    }

    public set _dataemissao(value: string | Date) {
        this.dataemissao = value;
    }

    public set _dataentrada(value: string | Date) {
        this.dataentrada = value;
    }
    // #endregion

    // #region METHODS

    // #endregion
}

export default Compras;