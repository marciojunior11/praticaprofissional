import FormasPagamento from "./FormasPagamento";
import Fisicas from "./Fisicas";
import CondicoesPagamento from "./CondicoesPagamento";
import PaiComId from "./PaiComId";

class Contratos extends PaiComId {
    // #region ATRIBUTOS
    private cliente: Fisicas;
    private condicaopagamento: CondicoesPagamento;
    private qtd: number;
    private vltotal: number;
    private datavalidade: string | Date;
    private flsituacao: string;
    // #endregion

    // #region CONSTRUCTOR
    constructor(
        id: number = 0,
        cliente: Fisicas = new Fisicas(),
        condicaopagamento: CondicoesPagamento = new CondicoesPagamento(),
        qtd: number = 0,
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
        this.qtd = qtd;
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

    public get _qtd() {
        return this.qtd;
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

    public set _qtd(value: number) {
        this.qtd = value;
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