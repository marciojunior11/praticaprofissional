export interface IGrades {
    id: number;
    descricao: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesGrades {
    descricao: string;
}

export interface IValidator {
    descricao: string;
}

export type TListaGrades = {
    data: IGrades[];
    qtd: number;
}