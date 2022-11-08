import { ICidades } from "./Cidades";
import { ICondicoesPagamento } from "./CondicoesPagamento";
import { IFornecedores } from "./Fornecedores";

export interface IProdutos {
    id: number;
    gtin: string;
    descricao: string;
    apelido: string;
    marca: string;
    undmedida: string;
    unidade: number;
    vlcusto: number;
    vlcompra: number;
    vlvenda: number;
    lucro: number;
    pesoliq: number;
    pesobruto: number;
    ncm: string;
    cfop: string;
    percicmssaida: number;
    percipi: number;
    cargatribut: number;
    vlfrete: number;
    qtdatual: number;
    qtdideal: number;
    qtdmin: number;
    fornecedor: IFornecedores;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesProdutos {
    gtin: string;
    descricao: string;
    apelido: string;
    marca: string;
    undmedida: string;
    unidade: number;
    vlcusto: number;
    vlcompra: number;
    vlvenda: number;
    lucro: number;
    pesoliq: number;
    pesobruto: number;
    ncm: string;
    cfop: string;
    percicmssaida: number;
    percipi: number;
    cargatribut: number;
    vlfrete: number;
    qtdatual: number;
    qtdideal: number;
    qtdmin: number;
    fornecedor: IFornecedores;
}

export interface IValidator {
    descricao: string;
}

export type TListaProdutos = {
    data: IProdutos[];
    qtd: number;
}