export interface IFormasPagamento {
    id: number;
    descricao: string;
    dataCad: Date
}

export interface IDetalhesFormasPagamento {
    id: number;
    descricao: string
}

export type TListaFormasPagamento = {
    data: IFormasPagamento[];
    qtd: number;
}