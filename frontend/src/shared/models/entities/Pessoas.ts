import Cidades from "./Cidades";
import CondicoesPagamento from "./CondicoesPagamento";
import PaiComId from "./PaiComId";

class Pessoas extends PaiComId {
    // #region ATRIBUTOS
    protected email: string;
    protected telefone: string;
    protected celular: string;
    protected cep: string;
    protected endereco: string;
    protected numend: string;
    protected bairro: string;
    protected cidade: Cidades;
    protected condicaopagamento: CondicoesPagamento;
    protected flsituacao: string;
    // #endregion

    // #region CONSTRUCTOR
    constructor(id: number = 0, email: string = "", telefone: string = "", celular: string = "", cep: string = "", endereco: string = "", numend: string = "", bairro: string = "", cidade: Cidades = new Cidades(), condicaopagamento: CondicoesPagamento = new CondicoesPagamento(), flsituacao: string = "", datacad: string | Date = new Date(), ultalt: string | Date = new Date()) {
        super();
        this.email = email;
        this.telefone = telefone;
        this.celular = celular;
        this.cep = cep;
        this.endereco = endereco;
        this.numend = numend;
        this.bairro = bairro;
        this.cidade = cidade;
        this.datacad = datacad;
        this.ultalt = ultalt;
        this.condicaopagamento = condicaopagamento;
        this.flsituacao = flsituacao;
    }
    // #endregion

    // #region GETTERS
    public get _email() {
        return this.email;
    }

    public get _telefone() {
        return this.telefone;
    }

    public get _celular() {
        return this.celular;
    }

    public get _cep() {
        return this.cep;
    }

    public get _endereco() {
        return this.endereco;
    }

    public get _numend() {
        return this.numend;
    }

    public get _bairro() {
        return this.bairro;
    }

    public get _cidade() {
        return this.cidade;
    }

    public get _flsituacao() {
        return this.flsituacao;
    }

    public get _condicaopagamento() {
        return this.condicaopagamento;
    }
    // #endregion

    // #region SETTERS
    public set _email(value: string) {
        this.email = value;
    }

    public set _telefone(value: string) {
        this.telefone = value;
    }

    public set _celular(value: string) {
        this.celular = value;
    }

    public set _cep(value: string) {
        this.cep = value;
    }

    public set _endereco(value: string) {
        this.endereco = value;
    }

    public set _numend(value: string) {
        this.numend = value;
    }

    public set _bairro(value: string) {
        this.bairro = value;
    }

    public set _cidade(value: Cidades) {
        this.cidade = value;
    }

    public set _condicaopagamento(value: CondicoesPagamento) {
        this.condicaopagamento = value;
    }

    public set _flsituacao(value: string) {
        this.flsituacao = value;
    }
    // #endregion
}

export default Pessoas;