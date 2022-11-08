import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { ICaracteristicas, IDetalhesCaracteristicas, IValidator, TListaCaracteristicas } from '../interfaces/entities/Caracteristicas';
import Caracteristicas from '../models/entities/Caracteristicas';
import Grades from '../models/entities/Grades';
import { IController } from './../interfaces/controllers/Controller';

class ControllerCaracteristicas implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaCaracteristicas | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/caracteristicas?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = `api/caracteristicas?_page=all`;
    
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

    getOne = async (id: number): Promise<ICaracteristicas | Error> => {
        try {

            const { data } = await Api.get(`/api/caracteristicas/${id}`);
    
            if (data) {
                return data;
            }
    
            return new Error('Erro ao consultar o registros.');
    
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }        
    }

    create = async (dados: Omit<IDetalhesCaracteristicas, 'id'>): Promise<number | undefined | Error> => {
        let grade = new Grades(dados.grade.id, dados.grade.descricao, new Date(), new Date());
        let caracteristica = new Caracteristicas(0, dados.descricao, grade, new Date(), new Date());
        try {
            const { data } = await Api.post<ICaracteristicas>('/api/caracteristicas', caracteristica);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesCaracteristicas): Promise<void | Error> => {
        let grade = new Grades(dados.grade.id, dados.grade.descricao, new Date(), new Date());
        let caracteristica = new Caracteristicas(id, dados.descricao, grade, new Date(), new Date());
        try {
            await Api.put(`/api/caracteristicas/${id}`, caracteristica);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/caracteristicas/${id}`);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: IValidator): Promise<boolean | Error> => {
        try {
            const { data } = await Api.post(`/api/caracteristicas/validate`, dados);
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

export default ControllerCaracteristicas;