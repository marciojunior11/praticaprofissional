import { ICondicoesPagamento } from "./CondicoesPagamento";
import { IFornecedores } from "./Fornecedores";

export interface ICompras {
    numnf: string;
    serienf: string;
    modelonf: string;
    fornecedor: IFornecedores;
    observacao: string | undefined;
    condicaopagamento: ICondicoesPagamento;
    vltotal: number;
    dataemissao: string | Date;
    dataentrada: string | Date;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesCompras {
    numnf: string;
    serienf: string;
    modelonf: string;
    fornecedor: IFornecedores;
    observacao: string | undefined;
    condicaopagamento: ICondicoesPagamento;
    vltotal: number;
    dataemissao: string | Date;
    dataentrada: string | Date;
}

export interface IValidator {
    numnf: string;
    serienf: string;
    modelonf: string;
    fornecedor: IFornecedores;
}

export type TListaCompras = {
    data: ICompras[];
    qtd: number;
}