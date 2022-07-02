import { IEstados } from '../estados/EstadosService';
import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface ICidades {
    id: number;
    cidade: string;
    estado: IEstados;
}

export interface IDetalhesCidades {
    id: number;
    cidade: string;
    estado: IEstados;
}

type TListaCidades = {
    data: ICidades[];
    qtd: number;
}

const getAll = async (page?: number, filter = ''): Promise<TListaCidades | Error> => {
    try {
        var urlRelativa = '';
        if (page != 0) urlRelativa = `/api/cidades?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
        else urlRelativa = `api/cidades?_page=all`;
        console.log(urlRelativa);

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

const getById = async (id : number): Promise<ICidades | Error> => {
    try {

        const { data } = await Api.get(`/api/cidades/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
    }    
}

const create = async (dados: Omit<IDetalhesCidades, 'id'>): Promise<number | undefined | Error> => {
    try {
        const { data } = await Api.post<ICidades>('/api/cidades', dados);
        if (data) {
            return data.id;
        }
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
    }     
}

const updateById = async (id : number, dados : IDetalhesCidades): Promise<void | Error> => {
    try {
        await Api.put(`/api/cidades/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
    }        
}

const deleteById = async (id : number): Promise<void | Error> => {
    try {
        await Api.delete(`/api/cidades/${id}`);
    } catch (error) {
        console.error('ERRO', error);
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
    }      
}

const validate = async (dados: Omit<IDetalhesCidades, 'id'>): Promise<boolean | Error> => {
    try {
        const { data } = await Api.post(`/api/cidades/validate`, dados);
        if (data != 0) {
            return false;
        } else {
            return true;
        }
        
    } catch (error) {
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');    
    }
}

export const CidadesService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    validate,
};