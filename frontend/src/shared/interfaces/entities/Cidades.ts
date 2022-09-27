import { IEstados } from "./Estados";

export interface ICidades {
    id: number;
    nmcidade: string;
    ddd: string | undefined;
    estado: IEstados;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesCidades {
    nmcidade: string;
    ddd: string | undefined;
    estado: IEstados;
}

export type TListaCidades = {
    data: ICidades[];
    qtd: number;
}