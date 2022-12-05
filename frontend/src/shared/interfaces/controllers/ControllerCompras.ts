import { IDetalhesCompras, IValidator } from "../entities/Compras";

type TGenericList = {
    data: Array<any>,
    qtd: number
}

export interface IControllerCompras {
    getAll(page?: number, filer?: string): Promise<TGenericList | Error>;
    getOne(dados: IValidator): Promise<any | Error>;
    create(dados: any): Promise<number | undefined | Error>;
    update(dados: IDetalhesCompras): Promise<void | Error>;
    delete(dados: IValidator): Promise<void | Error>;
}