import { Environment } from "../../../environment";
import { Api } from "../axios-config";
import { ICidades } from '../cidades/CidadesService';

export interface IFornecedores {
    id: number;
    razSocial: string;
    nomeFantasia: string | undefined;
    cnpj: string;
    telefone: string | undefined;
    endereco: string | undefined;
    numEnd: string | undefined;
    bairro: string | undefined;
    cidade: ICidades;
}

export interface IDetalhesFornecedores {
    id: number;
    razSocial: string;
    nomeFantasia: string | undefined;
    cnpj: string;
    telefone: string | undefined;
    endereco: string | undefined;
    numEnd: string | undefined;
    bairro: string | undefined;
    cidade: ICidades;
}

type TListaFornecedores = {
    data: IFornecedores[];
    qtd: number;
}

const getAll = async (page?: number, filter = ''): Promise<TListaFornecedores | Error> => {
    try {
        var urlRelativa = '';
        if (page != 0) urlRelativa = `/api/fornecedores?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
        else urlRelativa = `api/fornecedores?_page=all`;
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

const getById = async (id : number): Promise<IFornecedores | Error> => {
    try {

        const { data } = await Api.get(`/api/fornecedores/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
    }    
}

const create = async (dados: Omit<IDetalhesFornecedores, 'id'>): Promise<number | undefined | Error> => {
    try {
        const { data } = await Api.post<IFornecedores>('/api/fornecedores', dados);
        if (data) {
            return data.id;
        }
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
    }     
}

const updateById = async (id : number, dados : IDetalhesFornecedores): Promise<void | Error> => {
    try {
        await Api.put(`/api/fornecedores/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
    }        
}

const deleteById = async (id : number): Promise<void | Error> => {
    try {
        await Api.delete(`/api/fornecedores/${id}`);
    } catch (error) {
        console.error('ERRO', error);
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
    }      
}

const validate = async (dados: Omit<IDetalhesFornecedores, 'id'>): Promise<boolean | Error> => {
    try {
        const { data } = await Api.post(`/api/fornecedores/validate`, dados);
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

export const FornecedoresService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    validate,
};