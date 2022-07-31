export interface IPaises {
    id: number;
    nmpais: string;
    sigla: string;
    ddi: string;
    dataCad: string;
    ultAlt: string
}

export interface IDetalhesPaises {
    id: number;
    nmpais: string;
    sigla: string;
    ddi: string;
    dataCad: string;
    ultAlt: string
}

export type TListaPaises = {
    data: IPaises[];
    qtd: number;
}