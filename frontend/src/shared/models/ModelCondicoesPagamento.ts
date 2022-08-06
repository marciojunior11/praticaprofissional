import { TListaParcelas, IParcelas } from './ModelParcelas';
export interface ICondicoesPagamento {
    id: number;
    descricao: string;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    listaparcelas: IParcelas[];
    datacad: string;
    ultalt: string;
}

export interface IDetalhesCondicoesPagamento {
    id: number;
    descricao: string;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    listaparcelas: IParcelas[];
    datacad: string;
    ultalt: string;
}

export type TListaCondicoesPagamento = {
    data: ICondicoesPagamento[];
    qtd: number;
}