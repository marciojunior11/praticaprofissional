import { ICidades } from "./Cidades";
import { ICondicoesPagamento } from "./CondicoesPagamento";

export interface IFornecedores {
    id: number;
    razsocial: string;
    nmfantasia: string | undefined;
    email: string | undefined;
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
    nmfantasia: string | undefined;
    cnpj: string;
    inscestadual: string;
    telefone: string | undefined;
    celular: string | undefined;
    email: string | undefined;
    cep: string;
    endereco: string;
    numend: string;
    bairro: string;
    cidade: ICidades;
    condicaopagamento: ICondicoesPagamento;
    flsituacao: string | undefined;
}

export interface IValidator {
    cnpj: string;
}

export type TListaFornecedores = {
    data: IFornecedores[];
    qtd: number;
}