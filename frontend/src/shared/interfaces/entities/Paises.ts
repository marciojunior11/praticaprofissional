export interface IPaises {
    id: number;
    nmpais: string;
    sigla: string;
    ddi: string;
    datacad: string | Date;
    ultalt: string | Date;
}

export interface IDetalhesPaises {
    nmpais: string;
    sigla: string;
    ddi: string;
}

export type TListaPaises = {
    data: IPaises[];
    qtd: number;
}