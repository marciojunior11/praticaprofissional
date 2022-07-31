import { Environment } from "../../../environment";
import { Api } from "../axios-config";
import { IFormasPagamento, IDetalhesFormasPagamento, TListaFormasPagamento } from '../../../models/ModelFormasPagamento';

const getAll = async (page?: number, filter = ''): Promise<TListaFormasPagamento | Error> => {
    try {
        var urlRelativa = '';
        if (page != 0) urlRelativa = `/api/formaspagamento?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`
        else urlRelativa = 'api/formaspagamento?_page=all'
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

const getById = async (id : number): Promise<IFormasPagamento | Error> => {
    try {

        const { data } = await Api.get(`/api/formaspagamento/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
    }    
}

const create = async (dados: Omit<IDetalhesFormasPagamento, 'id'>): Promise<number | undefined | Error> => {
    try {
        const { data } = await Api.post<IFormasPagamento>('/api/formaspagamento', dados);
        if (data) {
            return data.id;
        }
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
    }     
}

const updateById = async (id : number, dados : IDetalhesFormasPagamento): Promise<void | Error> => {
    try {
        await Api.put(`/api/formaspagamento/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
    }        
}

const deleteById = async (id : number): Promise<void | Error> => {
    try {
        await Api.delete(`/api/formaspagamento/${id}`);
    } catch (error) {
        console.error('ERRO', error);
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
    }      
}

const validate = async (filter: string): Promise<boolean | Error> => {
    try {
        const { data } = await Api.get(`/api/formaspagamento?_filter=${filter}`);
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

export const FormasPagamentoService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    validate,
};