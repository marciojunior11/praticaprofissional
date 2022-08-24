import { IFormasPagamento } from './ModelFormasPagamento';
export interface IParcelas {
    numero: number;
    dias: number;
    percentual: number;
    formapagamento: IFormasPagamento;
    datacad: string;
    ultalt: string
}

export interface IDetalhesParcelas {
    numero: number;
    dias: number;
    percentual: number;
    formapagamento: IFormasPagamento;
    datacad: string;
    ultalt: string
}

const calcularPercentual = (listaParcelas: IParcelas[]) => {
    var totalPerc = 0;
    listaParcelas.forEach((parcela) => {
        totalPerc += parcela.percentual;
    })
    return totalPerc;
}

export const utils = {
    calcularPercentual,
}

export type TListaParcelas = {
    data: IParcelas[];
    qtd: number;
}