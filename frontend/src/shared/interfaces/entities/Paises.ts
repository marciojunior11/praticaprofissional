export interface IPaises {
    id: number;
    nmpais: string;
    sigla: string;
    ddi: string;
    datacad: string;
    ultalt: string
}

export interface IDetalhesPaises {
    id: number;
    nmpais: string;
    sigla: string;
    ddi: string;
    datacad: string;
    ultalt: string
}

export type TListaPaises = {
    data: IPaises[];
    qtd: number;
}