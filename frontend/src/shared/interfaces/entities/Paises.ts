export interface IPaises {
    id: number;
    nmpais: string;
    sigla: string;
    ddi: string;
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