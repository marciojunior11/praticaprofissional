import { ICentrosCusto } from './CentrosCusto';
import { IDetalhesFormasPagamento, IFormasPagamento } from './FormasPagamento';
import { IClientes } from './Clientes';
export interface IContasReceber {
    nrparcela: number;
    percparcela: number;
    dtvencimento: string | Date;
    vltotal: number;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    observacao: string;
    cliente: IClientes;
    formapagamento: IFormasPagamento;
    flcentrocusto: string;
    flsituacao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesContasReceber {
    nrparcela: number;
    percparcela: number;
    dtvencimento: string | Date;
    vltotal: number;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    observacao: string;
    cliente: IClientes;
    formapagamento: IFormasPagamento;
    flcentrocusto: string;
    flsituacao: string;
}

export type TListaContasReceber = {
    data: IContasReceber[];
    qtd: number;
}