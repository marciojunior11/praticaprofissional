export interface IParcelas {
    numero: number;
    dias: number;
    percentual: number;
    formapagamento: number;
    datacad: string;
    ultalt: string
}

export interface IDetalhesParcelas {
    numero: number;
    dias: number;
    percentual: number;
    formapagamento: number;
    datacad: string;
    ultalt: string
}

export type TListaParcelas = {
    data: IParcelas[];
    qtd: number;
}