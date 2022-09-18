type TGenericList = {
    data: Array<any>,
    qtd: number
}

export interface IController {

    getAll(page?: number, filer?: string): Promise<TGenericList | Error>;
    getOne(id: number): Promise<any | Error>;
    create(dados: any): Promise<number | undefined | Error>;
    update(id: number, dados: any): Promise<void | Error>;
    delete(id: number): Promise<void | Error>;
}