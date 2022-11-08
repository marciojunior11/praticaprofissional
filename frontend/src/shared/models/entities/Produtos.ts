import Juridicas from "./Juridicas";
import PaiComId from "./PaiComId";
import Variacoes from "./Variacoes";

class Produtos extends PaiComId {
    //ATRIBUTOS
    protected gtin: string;
    protected descricao: string;
    protected apelido: string;
    protected marca: string;
    protected undmedida: string;
    protected unidade: number;
    protected vlcusto: number;
    protected vlcompra: number;
    protected vlvenda: number;
    protected lucro: number;
    protected pesoliq: number;
    protected pesobruto: number;
    protected ncm: string;
    protected cfop: string;
    protected percicmssaida: number;
    protected percipi: number;
    protected cargatribut: number;
    protected vlfrete: number;
    protected qtdatual: number;
    protected qtdideal: number;
    protected qtdmin: number;
    protected fornecedor: Juridicas;
    protected listavariacoes: Variacoes[];

    //CONSTRUCTOR
    constructor(
        id: number = 0,
        gtin: string = "",
        descricao: string = "",
        apelido: string = "",
        marca: string = "",
        undmedida: string = "",
        unidade: number = 0,
        vlcusto: number = 0,
        vlcompra: number = 0,
        vlvenda: number = 0,
        lucro: number = 0,
        pesoliq: number = 0,
        pesobruto: number = 0,
        ncm: string = "",
        cfop: string = "",
        percicmssaida: number = 0,
        percipi: number = 0,
        cargatribut: number = 0,
        vlfrete: number = 0,
        qtdatual: number = 0,
        qtdideal: number = 0,
        qtdmin: number = 0,
        fornecedor: Juridicas = new Juridicas(),
        listavariacoes: Variacoes[] = [],
        datacad: Date | string = new Date(),
        ultalt: Date | string = new Date()
    ) {
        super();
        this.id = id;
        this.gtin = gtin;
        this.descricao = descricao;
        this.apelido = apelido;
        this.marca = marca;
        this.undmedida = undmedida;
        this.unidade = unidade;
        this.vlcusto = vlcusto;
        this.vlcompra = vlcompra;
        this.vlvenda = vlvenda;
        this.lucro = lucro;
        this.pesoliq = pesoliq;
        this.pesobruto = pesobruto;
        this.ncm = ncm;
        this.cfop = cfop;
        this.percicmssaida = percicmssaida;
        this.percipi = percipi;
        this.cargatribut = cargatribut;
        this.vlfrete = vlfrete;
        this.qtdatual = qtdatual;
        this.qtdideal = qtdideal;
        this.qtdmin = qtdmin;
        this.fornecedor = fornecedor;
        this.listavariacoes = listavariacoes;
        this.datacad = datacad;
        this.ultalt = ultalt; 
    }

    //GETTERS
    public get _gtin() {
        return this.gtin;
    }

    public get _descricao() {
        return this.descricao;
    }

    public get _apelido() {
        return this.apelido;
    }

    public get _marca() {
        return this.marca;
    }

    public get _undmedida() {
        return this.undmedida;
    }
    
    public get _unidade() {
        return this.unidade;
    }

    public get _vlcusto() {
        return this.vlcusto;
    }

    public get _vlcompra() {
        return this.vlcompra;
    }

    public get _vlvenda() {
        return this.vlvenda;
    }

    public get _lucro() {
        return this.lucro;
    }

    public get _pesoliq() {
        return this.pesoliq; 
    }

    public get _pesobruto() {
        return this.pesobruto;
    }

    public get _ncm() {
        return this.ncm;
    }

    public get _cfop() {
        return this.cfop;
    }

    public get _percicmssaida() {
        return this.percicmssaida;
    }
    
    public get _percipi() {
        return this.percipi;
    }

    public get _cargatribut() {
        return this.cargatribut;
    }

    public get _vlfrete() {
        return this.vlfrete;
    }

    public get _qtdatual() {
        return this.qtdatual;
    }

    public get _qtdideal() {
        return this.qtdideal;
    }

    public get _qtdmin() {
        return this.qtdmin;
    }

    public get _fornecedor() {
        return this.fornecedor;
    }

    public get _listavariacoes() {
        return this.listavariacoes;
    }

    //SETTERS
    public set _gtin(value: string) {
        this.gtin = value;
    }

    public set _descricao(value: string) {
        this.descricao = value;
    }

    public set _apelido(value: string) {
        this.apelido = value;
    }

    public set _marca(value: string) {
        this.marca = value;
    }

    public set _undmedida(value: string) {
        this.undmedida = value;
    }
    
    public set _unidade(value: number) {
        this.unidade = value;
    }

    public set _vlcusto(value: number) {
        this.vlcusto = value;
    }

    public set _vlcompra(value: number) {
        this.vlcompra = value;
    }

    public set _vlvenda(value: number) {
        this.vlvenda = value;
    }

    public set _lucro(value: number) {
        this.lucro = value;
    }

    public set _pesoliq(value: number) {
        this.pesoliq = value;
    }

    public set _pesobruto(value: number) {
        this.pesobruto = value;
    }

    public set _ncm(value: string) {
        this.ncm = value;
    }

    public set _cfop(value: string) {
        this.cfop = value;
    }

    public set _percicmssaida(value: number) {
        this.percicmssaida = value;
    }
    
    public set _percipi(value: number) {
        this.percipi = value;
    }

    public set _cargatribut(value: number) {
        this.cargatribut = value;
    }

    public set _vlfrete(value: number) {
        this.vlfrete = value;
    }

    public set _qtdatual(value: number) {
        this.qtdatual = value;
    }

    public set _qtdideal(value: number) {
        this.qtdideal = value;
    }

    public set _qtdmin(value: number) {
        this.qtdmin = value;
    }

    public set _fornecedor(value: Juridicas) {
        this.fornecedor = value;
    }

    public set _listavariacoes(value: Variacoes[]) {
        this.listavariacoes = value;
    }
}

export default Produtos;