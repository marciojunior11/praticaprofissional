import { IFormasPagamento } from './ModelFormasPagamento';
export interface IParcelas {
    numero: number;
    dias: number;
    percentual: number;
    formapagamento: IFormasPagamento;
    datacad: string;
    ultalt: string
}

export interface IDetalhesParcelas {
    numero: number;
    dias: number;
    percentual: number;
    formapagamento: IFormasPagamento;
    datacad: string;
    ultalt: string
}

export type TListaParcelas = {
    data: IParcelas[];
    qtd: number;
}