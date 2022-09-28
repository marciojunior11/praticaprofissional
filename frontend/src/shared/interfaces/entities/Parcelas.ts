import { IFormasPagamento } from './FormasPagamento';
export interface IParcelas {
    numero: number;
    dias: number;
    percentual: number;
    formapagamento: IFormasPagamento;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesParcelas {
    numero: number;
    dias: number;
    percentual: number;
    formapagamento: IFormasPagamento;
    datacad: string | Date;
    ultalt: string | Date;
}

export type TListaParcelas = {
    data: IParcelas[];
    qtd: number;
}