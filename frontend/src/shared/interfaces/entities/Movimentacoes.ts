export interface IMovimentacoes {
    id: number;
    tipo: string;
    dtmovimentacao: string | Date;
    valor: number;
    pessoa: any;
}

export type TListaMovimentacoes = {
    data: IMovimentacoes[];
    qtd: number;
}