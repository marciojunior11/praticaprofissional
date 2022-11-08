import { IGrades } from './../interfaces/entities/Grades';
import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IVariacoes, IDetalhesVariacoes, TListaVariacoes, IValidator } from '../interfaces/entities/Variacoes';
import Variacoes from '../models/entities/Variacoes';
import Caracteristicas from '../models/entities/Caracteristicas';
import Grades from '../models/entities/Grades';
import { IController } from './../interfaces/controllers/Controller';

class ControllerVariacoes implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaVariacoes | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/variacoes?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = `api/variacoes?_page=all`;
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

    getOne = async (id: number): Promise<IVariacoes | Error> => {
        try {
            const { data } = await Api.get(`/api/variacoes/${id}`);
            if (data) {
                return data;
            }
            return new Error('Erro ao consultar o registros.');
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }        
    }

    create = async (dados: Omit<IDetalhesVariacoes, 'id'>): Promise<number | undefined | Error> => {
        let grade = new Grades()
        let caracteristica = new Caracteristicas(dados.caracteristica.id, dados.caracteristica.descricao, grade, new Date(), new Date());
        let variacao = new Variacoes(0, dados.descricao, caracteristica, new Date(), new Date());
        try {
            const { data } = await Api.post<IVariacoes>('/api/variacoes', variacao);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesVariacoes): Promise<void | Error> => {
        let grade = new Grades();
        let caracteristica = new Caracteristicas(dados.caracteristica.id, dados.caracteristica.descricao, grade, new Date(), new Date());
        let variacao = new Variacoes(id, dados.descricao, caracteristica, new Date(), new Date());
        try {
            await Api.put(`/api/variacoes/${id}`, variacao);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/variacoes/${id}`);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: IValidator): Promise<boolean | Error> => {
        try {
            const { data } = await Api.post(`/api/variacoes/validate`, dados);
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

export default ControllerVariacoes;