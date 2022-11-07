import { IDetalhesParcelas, IParcelas } from "./Parcelas";

export interface ICondicoesPagamento {
    id: number;
    descricao: string;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    listaparcelas: IParcelas[];
    flsituacao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesCondicoesPagamento {
    descricao: string;
    txdesc: number;
    txmulta: number;
    txjuros: number;
    listaparcelas: IParcelas[];
    flsituacao: string;
}

export interface IValidator {
    descricao: string;
}

export type TListaCondicoesPagamento = {
    data: ICondicoesPagamento[];
    qtd: number;
}