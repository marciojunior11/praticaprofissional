import { ICondicoesPagamento } from "./CondicoesPagamento";
import { IContasReceber } from "./ContasReceber";
import { IFornecedores } from "./Fornecedores";
import { IClientes } from "./Clientes";
import { IProdutosNF } from "./ProdutosNF";

export interface IVendas {
    id: number;
    cliente: IClientes;
    observacao: string | undefined;
    condicaopagamento: ICondicoesPagamento;
    vltotal: number;
    listaprodutos: IProdutosNF[];
    listacontasreceber: IContasReceber[];
    flsituacao: string;
    dataemissao: string | Date;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesVendas {
    cliente: IClientes;
    observacao: string | undefined;
    condicaopagamento: ICondicoesPagamento;
    vltotal: number;
    listaprodutos: IProdutosNF[];
    listacontasreceber: IContasReceber[];
    flsituacao: string;
    dataemissao: string | Date;
}

export interface IValidator {
    id: number;
}

export type TListaVendas = {
    data: IVendas[];
    qtd: number;
}