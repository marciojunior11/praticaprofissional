type TGenericList = {
    data: Array<any>,
    qtd: number
}

export interface IControllerMovimentacoes {
    getAll(page?: number, filer?: string): Promise<TGenericList | Error>;
}