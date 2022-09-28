import PaiComId from "./PaiComId";
import Parcelas from "./Parcelas";

class CondicoesPagamento extends PaiComId {
    // #region ATRIBUTOS
    private descricao: string;
    private txdesc: number;
    private txmulta: number;
    private txjuros: number;
    private listaparcelas: Parcelas[];
    private flsituacao: string;
    // #endregion

    // #region CONSTRUCTOR
    constructor(id: number = 0, descricao: string = "", txdesc: number = 0, txmulta: number = 0, txjuros: number = 0, listaparcelas: Parcelas[] = [], flsituacao: string = "", datacad: string | Date = new Date(), ultalt: string | Date = new Date()) {
        super();
        this.id = id;
        this.descricao = descricao;
        this.txdesc = txdesc;
        this.txmulta = txmulta;
        this.txjuros = txjuros;
        this.listaparcelas = listaparcelas;
        this.flsituacao = flsituacao;
        this.datacad = datacad;
        this.ultalt = ultalt;
    }
    // #endregion

    // #region GETTERS
    public get _descricao() {
        return this.descricao;
    }

    public get _txdesc() {
        return this.txdesc;
    }

    public get _txmulta() {
        return this.txmulta;
    }

    public get _txjuros() {
        return this.txjuros;
    }

    public get _listaparcelas() {
        return this.listaparcelas;
    }

    public get _flsituacao() {
        return this.flsituacao;
    }
    // #endregion

    // #region SETTERS
    public set _descricao(value: string) {
        this.descricao = value;
    }

    public set _txdesc(value: number) {
        this.txdesc = value;
    } 
    
    public set _txmulta(value: number) {
        this.txmulta = value;
    } 
    
    public set _txjuros(value: number) {
        this.txjuros = value;
    }  
    
    public set _listaparcelas(value: Parcelas[]) {
        this.listaparcelas = value;
    }    

    public set _flsituacao(value: string) {
        this.flsituacao = value;
    }    
    // #endregion

    // #region METHODS
    public calculaTotalPercentParcelas() {
        let total = 0;
        this.listaparcelas.forEach(parcela => {
            total += parcela._percentual;
        });
        return total;
    }
    // #endregion
}