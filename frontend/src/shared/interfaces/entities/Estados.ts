import Paises from "../../models/entities/Paises";
import { IPaises } from "./Paises";

export interface IEstados {
    id: number;
    nmestado: string;
    uf: string;
    pais: IPaises;
    datacad: Date | string;
    ultalt: Date | string;
}

export interface IDetalhesEstados {
    id: number;
    nmestado: string;
    uf: string;
    pais: IPaises;
    datacad: Date | string;
    ultalt: Date | string;
}

export type TListaEstados = {
    data: IEstados[];
    qtd: number;
}