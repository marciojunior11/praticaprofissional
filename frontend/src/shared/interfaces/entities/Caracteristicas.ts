import { IGrades } from "./Grades";

export interface ICaracteristicas {
    id: number;
    descricao: string;
    grade: IGrades;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesCaracteristicas {
    descricao: string;
    grade: IGrades;
}

export interface IValidator {
    descricao: string;
}

export type TListaCaracteristicas = {
    data: ICaracteristicas[];
    qtd: number;
}