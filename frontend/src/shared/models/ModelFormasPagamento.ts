export interface IFormasPagamento {
    id: number;
    descricao: string;
    dataCad: string;
    ultAlt: string;
}

export interface IDetalhesFormasPagamento {
    id: number;
    descricao: string;
    dataCad: string;
    ultAlt: string;
}

export type TListaFormasPagamento = {
    data: IFormasPagamento[];
    qtd: number;
}