import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IFormasPagamento, IDetalhesFormasPagamento, TListaFormasPagamento } from '../interfaces/entities/FormasPagamento';
import FormasPagamento from '../models/entities/FormasPagamento';
import { IController } from './../interfaces/controllers/Controller';

class ControllerFormasPagamento implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaFormasPagamento | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/formaspagamento?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = `api/formaspagamento?_page=all`;
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
    }

    getOne = async (id: number): Promise<IFormasPagamento | Error> => {
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

    create = async (dados: Omit<IDetalhesFormasPagamento, 'id'>): Promise<number | undefined | Error> => {
        let formapagamento = new FormasPagamento(
            0,
            dados.descricao,
            new Date(),
            new Date()
        );
        try {
            const { data } = await Api.post<IFormasPagamento>('/api/formaspagamento', formapagamento);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesFormasPagamento): Promise<void | Error> => {
        let formapagamento = new FormasPagamento(
            id,
            dados.descricao,
            new Date(),
            new Date()
        )
        try {
            await Api.put(`/api/formaspagamento/${id}`, formapagamento);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/formaspagamento/${id}`);
        } catch (error) {
            return new Error((error as {message:string; response: any}).response.data.detail || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: Omit<IDetalhesFormasPagamento, 'id'>): Promise<boolean | Error> => {
        try {
            const { data } = await Api.post(`/api/formaspagamento/validate`, dados);
            if (data != 0) {
                return false;
            } else {
                return true;
            }
            
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');    
        }       
    }
}

export default ControllerFormasPagamento;