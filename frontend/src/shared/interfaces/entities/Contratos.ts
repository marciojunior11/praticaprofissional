import { ICondicoesPagamento } from './CondicoesPagamento';
import { IClientes } from './Clientes';
export interface IContratos {
    id: number;
    cliente: IClientes;
    condicaopagamento: ICondicoesPagamento;
    qtd: number;
    vltotal: number;
    datavalidade: string | Date;
    flsituacao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesContratos {
    cliente: IClientes;
    condicaopagamento: ICondicoesPagamento;
    qtd: number;
    vltotal: number;
    datavalidade: string | Date;
    flsituacao: string;
}

export type TListaContratos = {
    data: IContratos[];
    qtd: number;
}