import { ICidades } from "./Cidades";
import { ICondicoesPagamento } from "./CondicoesPagamento";

export interface IFornecedores {
    id: number;
    razsocial: string;
    nmfantasia: string;
    email: string;
    telefone: string;
    celular: string;
    cnpj: string;
    inscestadual: string;
    cep: string;
    endereco: string;
    numend: string;
    bairro: string;
    cidade: ICidades;
    condicaopagamento: ICondicoesPagamento;
    flsituacao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesFornecedores {
    razsocial: string;
    nmfantasia: string;
    telefone: string;
    celular: string;
    email: string;
    cnpj: string;
    inscestadual: string;
    cep: string;
    endereco: string;
    numend: string;
    bairro: string;
    cidade: ICidades;
    condicaopagamento: ICondicoesPagamento;
    flsituacao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export type TListaFornecedores = {
    data: IFornecedores[];
    qtd: number;
}