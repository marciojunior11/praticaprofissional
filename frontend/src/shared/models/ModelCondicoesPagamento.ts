export interface ICondicoesPagamento {
    id: number;
    descricao: string;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    datacad: string;
    ultalt: string;
}

export interface IDetalhesCondicoesPagamento {
    id: number;
    descricao: string;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    datacad: string;
    ultalt: string;
}

export type TListaCondicoesPagamento = {
    data: ICondicoesPagamento[];
    qtd: number;
}