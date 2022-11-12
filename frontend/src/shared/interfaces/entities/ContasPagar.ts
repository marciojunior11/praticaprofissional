import { ICentrosCusto } from './CentrosCusto';
import { IDetalhesFormasPagamento, IFormasPagamento } from './FormasPagamento';
import { IFornecedores } from './Fornecedores';
export interface IContasPagar {
    nrparcela: number;
    dtvencimento: string | Date;
    valor: number;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    fornecedor: IFornecedores;
    formapagamento: IFormasPagamento;
    centrocusto: ICentrosCusto;
    flsituacao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesContasPagar {
    nrparcela: number;
    dtvencimento: string | Date;
    valor: number;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    fornecedor: IFornecedores;
    formapagamento: IFormasPagamento;
    centrocusto: ICentrosCusto;
    flsituacao: string;
}

export type TListaContasPagar = {
    data: IContasPagar[];
    qtd: number;
}