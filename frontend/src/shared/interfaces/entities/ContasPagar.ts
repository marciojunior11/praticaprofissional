import { ICentrosCusto } from './CentrosCusto';
import { IDetalhesFormasPagamento, IFormasPagamento } from './FormasPagamento';
import { IFornecedores } from './Fornecedores';
export interface IContasPagar {
    nrparcela: number;
    percparcela: number;
    dtvencimento: string | Date;
    vltotal: number;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    observacao: string;
    fornecedor: IFornecedores;
    formapagamento: IFormasPagamento;
    flcentrocusto: string;
    flsituacao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesContasPagar {
    nrparcela: number;
    percparcela: number;
    dtvencimento: string | Date;
    vltotal: number;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    observacao: string;
    fornecedor: IFornecedores;
    formapagamento: IFormasPagamento;
    flcentrocusto: string;
    flsituacao: string;
}

export type TListaContasPagar = {
    data: IContasPagar[];
    qtd: number;
}