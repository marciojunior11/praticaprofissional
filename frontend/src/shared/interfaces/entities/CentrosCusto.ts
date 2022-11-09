export interface ICentrosCusto {
    id: number;
    descricao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesCentrosCusto {
    descricao: string;
}

export interface IValidator {
    descricao: string;
}

export type TListaCentrosCusto = {
    data: ICentrosCusto[];
    qtd: number;
}