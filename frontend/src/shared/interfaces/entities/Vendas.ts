import { ICondicoesPagamento } from "./CondicoesPagamento";
import { IContasReceber } from "./ContasReceber";
import { IFornecedores } from "./Fornecedores";
import { IClientes } from "./Clientes";
import { IProdutosNF } from "./ProdutosNF";

export interface IVendas {
    numnf: string;
    serienf: string;
    cliente: IClientes;
    observacao: string | undefined;
    condicaopagamento: ICondicoesPagamento;
    listaprodutos: IProdutosNF[];
    listacontasreceber: IContasReceber[];
    vltotal: number;
    dataemissao: string | Date;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesVendas {
    cliente: IClientes;
    observacao: string | undefined;
    condicaopagamento: ICondicoesPagamento;
    listaprodutos: IProdutosNF[];
    listacontasreceber: IContasReceber[];
    vltotal: number;
    flsituacao: string;
    dataemissao: string | Date;
}

export interface IValidator {
    numnf: string;
    serienf: string;
    icliente: number | undefined;
}

export type TListaVendas = {
    data: IVendas[];
    qtd: number;
}