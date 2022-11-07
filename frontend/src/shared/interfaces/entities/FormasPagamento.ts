export interface IFormasPagamento {
    id: number;
    descricao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesFormasPagamento {
    descricao: string;
}

export type TListaFormasPagamento = {
    data: IFormasPagamento[];
    qtd: number;
}