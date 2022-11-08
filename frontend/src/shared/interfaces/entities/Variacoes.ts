import { ICaracteristicas } from './Caracteristicas';

export interface IVariacoes {
    id: number;
    descricao: string;
    caracteristica: ICaracteristicas;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesVariacoes {
    descricao: string;
    caracteristica: ICaracteristicas;
}

export interface IValidator {
    descricao: string;
    caracteristica: ICaracteristicas
}

export type TListaVariacoes = {
    data: IVariacoes[];
    qtd: number;
}