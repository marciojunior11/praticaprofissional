export interface IParcelas {
    numero: number;
    dias: number;
    percentual: number;
    formapagamento: number;
    dataCad: string;
    ultAlt: string
}

export interface IDetalhesParcelas {
    numero: number;
    dias: number;
    percentual: number;
    formapagamento: number;
    dataCad: string;
    ultAlt: string
}

export type TListaParcelas = {
    data: IParcelas[];
    qtd: number;
}