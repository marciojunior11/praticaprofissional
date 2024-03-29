import { IPaises } from "../../../interfaces/entities/Paises";
import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IEstados {
    id: number;
    estado: string;
    uf: string;
    pais: IPaises;
}

export interface IDetalhesEstados {
    id: number;
    estado: string;
    uf: string;
    pais: IPaises;
}

type TListaEstados = {
    data: IEstados[];
    qtd: number;
}

const getAll = async (page?: number, filter = ''): Promise<TListaEstados | Error> => {
    try {
        var urlRelativa = '';
        if (page != 0) urlRelativa = `/api/estados?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
        else urlRelativa = `api/estados?_page=all`;
        console.log(urlRelativa)

        const { data } = await Api.get(urlRelativa);

        if (data) {
            return {
                data: data.data,
                qtd: data.totalCount
            };
        }

        return new Error('Erro ao listar os registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao listar os registros.');
    }
};

const getById = async (id : number): Promise<IEstados | Error> => {
    try {

        const { data } = await Api.get(`/api/estados/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
    }    
}

const create = async (dados: Omit<IDetalhesEstados, 'id'>): Promise<number | undefined | Error> => {
    try {
        const { data } = await Api.post<IEstados>('/api/estados', dados);
        if (data) {
            return data.id;
        }
    } catch (error) {
        return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
    }     
}

const updateById = async (id : number, dados : IDetalhesEstados): Promise<void | Error> => {
    try {
        await Api.put(`/api/estados/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
    }        
}

const deleteById = async (id : number): Promise<void | Error> => {
    try {
        await Api.delete(`/api/estados/${id}`);
    } catch (error) {
        console.error('ERRO', error);
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
    }      
}

const validate = async (dados: Omit<IDetalhesEstados, 'id'>): Promise<boolean | Error> => {
    try {
        const { data } = await Api.post(`/api/estados/validate`, dados);
        if (data != 0) {
            return false;
        } else {
            return true;
        }
        
    } catch (error) {
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');    
    }
}

export const EstadosService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    validate,
};