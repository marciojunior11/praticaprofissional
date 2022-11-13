import { ICondicoesPagamento } from "./CondicoesPagamento";
import { IFornecedores } from "./Fornecedores";
import { IProdutosNF } from "./ProdutosNF";

export interface ICompras {
    numnf: string;
    serienf: string;
    modelonf: string;
    fornecedor: IFornecedores;
    observacao: string | undefined;
    condicaopagamento: ICondicoesPagamento;
    listaprodutos: IProdutosNF[];
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
    listaprodutos: IProdutosNF[];
    vltotal: number;
    flsituacao: string;
    dataemissao: string | Date;
    dataentrada: string | Date;
}

export interface IValidator {
    numnf: string;
    serienf: string;
    modelonf: string;
    idfornecedor: number | undefined;
}

export type TListaCompras = {
    data: ICompras[];
    qtd: number;
}