import { ICidades } from "./Cidades";
import { ICondicoesPagamento } from "./CondicoesPagamento";
import { IFornecedores } from "./Fornecedores";
import { IVariacoes } from "./Variacoes";

export interface IProdutosNF {
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
    //vlfrete: number;
    //vlpedagio: number;
    //vloutrasdespesas: number;
    qtdatual: number;
    qtdideal: number;
    qtdmin: number;
    fornecedor: IFornecedores;
    listavariacoes: IVariacoes[];
    qtd: number;
    vltotal: number;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesProdutosNF {
    gtin: string;
    descricao: string;
    apelido: string | undefined;
    marca: string;
    undmedida: string;
    unidade: number | undefined;
    vlcusto: number;
    vlcompra: number;
    vlvenda: number;
    lucro: number;
    pesoliq: number | undefined;
    pesobruto: number | undefined;
    ncm: string;
    cfop: string;
    percicmssaida: number | undefined;
    percipi: number | undefined;
    cargatribut: number;
    vlfrete: number;
    qtdatual: number;
    qtdideal: number | undefined;
    qtdmin: number | undefined;
    fornecedor: IFornecedores;
    listavariacoes: IVariacoes[];
    qtd: number;
    vltotal: number;
}

export interface IValidator {
    descricao: string;
}

export type TListaProdutosNF = {
    data: IProdutosNF[];
    qtd: number;
}