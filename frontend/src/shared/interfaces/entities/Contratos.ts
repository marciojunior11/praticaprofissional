import { ICondicoesPagamento } from './CondicoesPagamento';
import { IClientes } from './Clientes';
import { IContasReceber } from './ContasReceber';
export interface IContratos {
    id: number;
    cliente: IClientes;
    condicaopagamento: ICondicoesPagamento;
    listacontasreceber: IContasReceber[];
    qtdmeses: number;
    vltotal: number;
    datavalidade: string | Date;
    flsituacao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesContratos {
    cliente: IClientes;
    condicaopagamento: ICondicoesPagamento;
    listacontasreceber: IContasReceber[];
    qtdmeses: number;
    vltotal: number;
    datavalidade: string | Date;
    flsituacao: string;
}

export interface IValidator {
    id: number;
}

export type TListaContratos = {
    data: IContratos[];
    qtd: number;
}