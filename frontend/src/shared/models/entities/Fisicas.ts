import Cidades from "./Cidades";
import CondicoesPagamento from "./CondicoesPagamento";
import Pessoas from "./Pessoas";

class Fisicas extends Pessoas {
    // #region ATRIBUTOS
    private nome: string;
    private cpf: string;
    private rg: string;
    private datanasc: string | Date;
    // #endregion

    // #region CONSTRUCTOR
    constructor(id: number = 0, nome: string = "", cpf: string = "", rg: string = "", datanasc: string | Date = new Date(), email: string = "", telefone: string = "", celular: string = "", cep: string = "", endereco: string = "", numend: string = "", bairro: string = "", cidade: Cidades = new Cidades(), condicaopagamento: CondicoesPagamento = new CondicoesPagamento(), flsituacao: string = "", datacad: string | Date = new Date(), ultalt: string | Date = new Date()) {
        super();
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.rg = rg;
        this.datanasc = datanasc;
        this.email = email;
        this.telefone = telefone;
        this.celular = celular;
        this.cep = cep;
        this.endereco = endereco;
        this.numend = numend;
        this.bairro = bairro;
        this.cidade = cidade;
        this.condicaopagamento = condicaopagamento;
        this.flsituacao = flsituacao;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }  
    // #endregion

    // #region GETTERS
    public get _nome() {
        return this.nome;
    }

    public get _cpf() {
        return this.cpf;
    }

    public get _rg() {
        return this.rg;
    }

    public get _datanasc() {
        return this.datanasc;
    }
    // #endregion

    // #region SETTERS
    public set _nome(value: string) {
        this.nome = value;
    }

    public set _cpf(value: string) {
        this.cpf = value;
    }

    public set _rg(value: string) {
        this.rg = value;
    }

    public set _datanasc(value: string | Date) {
        this.datanasc = value;
    }
    // #endregion
}

export default Fisicas;