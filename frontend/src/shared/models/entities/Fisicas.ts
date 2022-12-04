import Cidades from "./Cidades";
import CondicoesPagamento from "./CondicoesPagamento";
import Pessoas from "./Pessoas";

class Fisicas extends Pessoas {
    // #region ATRIBUTOS
    private nmcliente: string;
    private sexo: string;
    private cpf: string;
    private rg: string;
    private datanasc: string | Date;
    private flassociado: string;
    // #endregion

    // #region CONSTRUCTOR
    constructor(
        id: number = 0, 
        nmcliente: string = "",
        sexo: string = "",
        cpf: string = "", 
        rg: string = "", 
        datanasc: string | Date = new Date(), 
        email: string = "", 
        telefone: string = "", 
        celular: string = "", 
        cep: string = "", 
        endereco: string = "", 
        numend: string = "", 
        bairro: string = "", 
        cidade: Cidades = new Cidades(), 
        condicaopagamento: CondicoesPagamento = new CondicoesPagamento(), 
        flsituacao: string = "",
        flassociado: string = "",
        datacad: string | Date = new Date(), 
        ultalt: string | Date = new Date()
    ) {
        super();
        this.id = id;
        this.nmcliente = nmcliente;
        this.sexo = sexo;
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
        this.flassociado = flassociado;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }  
    // #endregion

    // #region GETTERS
    public get _nmcliente() {
        return this.nmcliente;
    }

    public get _sexo() {
        return this.sexo;
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

    public get _flassociado() {
        return this.flassociado;
    }
    // #endregion

    // #region SETTERS
    public set _nmcliente(value: string) {
        this.nmcliente = value;
    }

    public set _sexo(value: string) {
        this.sexo = value;
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

    public set _flassociado(value: string) {
        this.flassociado = value;
    }
    // #endregion
}

export default Fisicas;