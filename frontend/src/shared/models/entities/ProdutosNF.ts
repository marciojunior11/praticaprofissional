import Juridicas from "./Juridicas";
import Produtos from "./Produtos";
import Variacoes from "./Variacoes";

class ProdutosNF extends Produtos {
    //ATRIBUTOS
    private qtd: number;
    private vltotal: number;

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
        qtdatual: number = 0,
        qtdideal: number = 0,
        qtdmin: number = 0,
        fornecedor: Juridicas = new Juridicas(),
        listavariacoes: Variacoes[] = [],
        qtd: number = 0,
        vltotal: number = 0,
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
        this.qtdatual = qtdatual;
        this.qtdideal = qtdideal;
        this.qtdmin = qtdmin;
        this.fornecedor = fornecedor;
        this.listavariacoes = listavariacoes;
        this.qtd = qtd;
        this.vltotal = vltotal;
        this.datacad = datacad;
        this.ultalt = ultalt; 
    }

    //GETTERS
    public get _qtd() {
        return this.qtd;
    }

    public get _vltotal() {
        return this.vltotal;
    }

    //SETTERS
    public set _qtd(value: number) {
        this.qtd = value;
    }

    public set _vltotal(value: number) {
        this.vltotal = value;
    }

}

export default ProdutosNF;