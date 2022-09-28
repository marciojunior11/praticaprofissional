export interface IFormasPagamento {
    id: number;
    descricao: string;
    dataCad: string | Date;
    ultAlt: string | Date;
}

export interface IDetalhesFormasPagamento {
    descricao: string;
    dataCad: string | Date;
    ultAlt: string | Date;
}

export type TListaFormasPagamento = {
    data: IFormasPagamento[];
    qtd: number;
}