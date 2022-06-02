import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IClientes {
    id: number;
    nome: string;
    /*cpf: string;
    rg: string;
    telefone: string;
    endereco: string;
    numResid: string;
    bairro: string;
    idCidade: number;
    associado: boolean;*/
}

export interface IDetalhesCliente {
    id: number;
    nome: string;
    /*cpf: string;
    rg: string;
    telefone: string;
    endereco: string;
    numResid: string;
    bairro: string;
    idCidade: number;
    associado: boolean;*/
}

type TListaClientes = {
    data: IClientes[];
    count: number;
}

const getAll = async (page = 1, filter = ''): Promise<TListaClientes | Error> => {
    try {

        const urlRelativa = `/clientes?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

        const { data, headers } = await Api.get(urlRelativa);

        if (data) {
            return {
                data,
                count: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
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

        const { data } = await Api.get(`/clientes/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
    }    
}

const create = async (dados : Omit<IClientes, 'id'>): Promise<number | Error> => {
    try {

        const { data } = await Api.post<IClientes>('/clientes', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
    }     
}

const updateById = async (id : number, dados : IClientes): Promise<void | Error> => {
    try {
        await Api.put(`/clientes/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
    }        
}

const deleteById = async (id : number): Promise<void | Error> => {
    try {
        await Api.delete(`/clientes/${id}`);
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
    }      
}

export const ClientesServices = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
};