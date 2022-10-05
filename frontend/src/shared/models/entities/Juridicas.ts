import Cidades from "./Cidades";
import CondicoesPagamento from "./CondicoesPagamento";
import Pessoas from "./Pessoas";

class Juridicas extends Pessoas {
    // #region ATRIBUTOS
    razsocial: string;
    nmfantasia: string;
    cnpj: string;
    inscestadual: string;
    // #endregion

    // #region CONSTRUCTOR
    constructor(id: number = 0, razsocial: string = "", nmfantasia: string = "", cnpj: string = "", inscestadual: string = "", email: string = "", telefone: string = "", celular: string = "", cep: string = "", endereco: string = "", numend: string = "", bairro: string = "", cidade: Cidades = new Cidades(), condicaopagamento: CondicoesPagamento = new CondicoesPagamento(), flsituacao: string = "", datacad: string | Date = new Date(), ultalt: string | Date = new Date()) {
        super();
        this.id = id;
        this.razsocial = razsocial;
        this.nmfantasia = nmfantasia;
        this.cnpj = cnpj;
        this.inscestadual = inscestadual;
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
    public get _razsocial() {
        return this.razsocial;
    }

    public get _nmfantasia() {
        return this.nmfantasia;
    }

    public get _cnpj() {
        return this.cnpj;
    }

    public get _inscestadual() {
        return this.inscestadual;
    }
    // #endregion

    // #region SETTERS
    public set _razsocial(value: string) {
        this.razsocial = value;
    }

    public set _nmfantasia(value: string) {
        this.nmfantasia = value;
    }

    public set _cnpj(value: string) {
        this.cnpj = value;
    }

    public set _inscestadual(value: string) {
        this.inscestadual = value;
    }
    // #endregion
}

export default Juridicas;