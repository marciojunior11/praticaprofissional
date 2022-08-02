import { Environment } from "../../../environment";
import { Api } from "../axios-config";
import { ICondicoesPagamento, IDetalhesCondicoesPagamento, TListaCondicoesPagamento } from '../../../models/ModelCondicoesPagamento';

const getAll = async (page?: number, filter = ''): Promise<TListaCondicoesPagamento | Error> => {
    try {
        var urlRelativa = '';
        if (page != 0) urlRelativa = `/api/condicoespagamento?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`
        else urlRelativa = 'api/condicoespagamento?_page=all'
        console.log(urlRelativa);

        const { data } = await Api.get(urlRelativa);

        console.log(data);
        
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

const getById = async (id : number): Promise<ICondicoesPagamento | Error> => {
    try {

        const { data } = await Api.get(`/api/condicoespagamento/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
    }    
}

const create = async (dados: Omit<IDetalhesCondicoesPagamento, 'id'>): Promise<number | undefined | Error> => {
    try {
        const { data } = await Api.post<ICondicoesPagamento>('/api/condicoespagamento', dados);
        if (data) {
            return data.id;
        }
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
    }     
}

const updateById = async (id : number, dados : IDetalhesCondicoesPagamento): Promise<void | Error> => {
    try {
        await Api.put(`/api/condicoespagamento/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
    }        
}

const deleteById = async (id : number): Promise<void | Error> => {
    try {
        await Api.delete(`/api/condicoespagamento/${id}`);
    } catch (error) {
        console.error('ERRO', error);
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
    }      
}

const validate = async (filter: string): Promise<boolean | Error> => {
    try {
        const { data } = await Api.get(`/api/condicoespagamento?_filter=${filter}`);
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

export const CondicoesPagamentoService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    validate,
};