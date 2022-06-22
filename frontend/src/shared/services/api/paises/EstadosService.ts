import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IEstados {
    id: number;
    pais: string;
    sigla: string;
}

export interface IDetalhesEstados {
    id: number;
    pais: string;
    sigla: string;
}

type TListaEstados = {
    data: IEstados[];
    qtd: number;
}

const getAll = async (page = 1, filter = ''): Promise<TListaEstados | Error> => {
    try {

        const urlRelativa = `/api/estados?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

        const response = await Api.get(urlRelativa);

        if (response) {
            return {
                data: response.data.rows,
                qtd: response.data.rowCount
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
        console.error(error);
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

const validate = async (filter: string): Promise<boolean | Error> => {
    try {
        const response = await Api.get(`/api/estados?_filter=${filter}`);
        if (response.data.rowCount != 0) {
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