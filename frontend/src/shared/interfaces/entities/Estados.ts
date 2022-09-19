import Paises from "../../models/entities/Paises";
import { IPaises } from "./Paises";

export interface IEstados {
    id: number;
    nmestado: string;
    uf: string;
    pais: IPaises;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesEstados {
    nmestado: string;
    uf: string;
    pais: IPaises;
}

export type TListaEstados = {
    data: IEstados[];
    qtd: number;
}