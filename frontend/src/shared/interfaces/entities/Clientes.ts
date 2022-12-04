import { ICidades } from "./Cidades";
import { ICondicoesPagamento } from "./CondicoesPagamento";

export interface IClientes {
    id: number;
    nome: string;
    cpf: string;
    rg: string;
    email: string | undefined;
    telefone: string;
    celular: string;
    cep: string;
    endereco: string;
    numend: string;
    bairro: string;
    cidade: ICidades;
    condicaopagamento: ICondicoesPagamento;
    flsituacao: string;
    flassociado: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesClientes {
    id: number;
    nome: string;
    cpf: string;
    rg: string;
    email: string | undefined;
    telefone: string;
    celular: string;
    cep: string;
    endereco: string;
    numend: string;
    bairro: string;
    cidade: ICidades;
    condicaopagamento: ICondicoesPagamento;
    flsituacao: string;
    flassociado: string;
}

export interface IValidator {
    cnpj: string;
}

export type TListaClientes = {
    data: IClientes[];
    qtd: number;
}