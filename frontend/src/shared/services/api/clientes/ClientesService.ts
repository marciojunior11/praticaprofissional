import { Environment } from "../../../environment";
import { Api } from "../axios-config";
import { ICidades } from '../cidades/CidadesService';

export interface IClientes {
    id: number,
    nome: string,
    cpf: string,
    rg: string | undefined,
    telefone: string | undefined,
    endereco: string | undefined,
    numEnd: string | undefined,
    bairro: string | undefined,
    cidade: ICidades,
    associado: boolean
}

export interface IDetalhesClientes {
    id: number,
    nome: string,
    cpf: string,
    rg: string | undefined,
    telefone: string | undefined,
    endereco: string | undefined,
    numEnd: string | undefined,
    bairro: string | undefined,
    cidade: ICidades,
    associado: boolean
}

type TListaClientes = {
    data: IClientes[];
    qtd: number;
}

const getAll = async (page?: number, filter = ''): Promise<TListaClientes | Error> => {
    try {
        var urlRelativa = '';
        if (page != 0) urlRelativa = `/api/clientes?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
        else urlRelativa = `api/clientes?_page=all`;
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

const getById = async (id : number): Promise<IClientes | Error> => {
    try {

        const { data } = await Api.get(`/api/clientes/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
    }    
}

const create = async (dados: Omit<IDetalhesClientes, 'id'>): Promise<number | undefined | Error> => {
    try {
        const { data } = await Api.post<IClientes>('/api/clientes', dados);
        if (data) {
            return data.id;
        }
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
    }     
}

const updateById = async (id : number, dados : IDetalhesClientes): Promise<void | Error> => {
    try {
        await Api.put(`/api/clientes/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
    }        
}

const deleteById = async (id : number): Promise<void | Error> => {
    try {
        await Api.delete(`/api/clientes/${id}`);
    } catch (error) {
        console.error('ERRO', error);
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
    }      
}

const validate = async (dados: Omit<IDetalhesClientes, 'id'>): Promise<boolean | Error> => {
    try {
        const { data } = await Api.post(`/api/clientes/validate`, dados);
        console.log(data);
        if (data != 0) {
            return false;
        } else {
            return true;
        }
        
    } catch (error) {
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');    
    }
}

export const ClientesService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    validate,
};