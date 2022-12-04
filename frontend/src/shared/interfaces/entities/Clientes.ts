import { ICidades } from "./Cidades";
import { ICondicoesPagamento } from "./CondicoesPagamento";

export interface IClientes {
    id: number;
    nmcliente: string;
    sexo: string;
    datanasc: string | Date;
    cpf: string;
    rg: string;
    email: string;
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
    nmcliente: string;
    sexo: string;
    datanasc: string | Date;
    cpf: string;
    rg: string | undefined;
    email: string | undefined;
    telefone: string | undefined;
    celular: string | undefined;
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
    cpf: string;
}

export type TListaClientes = {
    data: IClientes[];
    qtd: number;
}