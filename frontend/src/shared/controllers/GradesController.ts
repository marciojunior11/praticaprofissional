import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IGrades, IDetalhesGrades, TListaGrades, IValidator } from '../interfaces/entities/Grades';
import Grades from '../models/entities/Grades';
import { IController } from './../interfaces/controllers/Controller';

class ControllerGrades implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaGrades | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/grades?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = 'api/grades?_page=all'

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

    getOne = async (id: number): Promise<IGrades | Error> => {
        try {

            const { data } = await Api.get(`/api/grades/${id}`);
    
            if (data) {
                return data;
            }
    
            return new Error('Erro ao consultar o registros.');
    
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }         
    }

    create = async (dados: Omit<IDetalhesGrades, 'id'>): Promise<number | undefined | Error> => {
        let grade = new Grades(0, dados.descricao, new Date(), new Date());
        try {
            const { data } = await Api.post<IGrades>('/api/grades', grade);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesGrades): Promise<void | Error> => {
        let grade = new Grades(id, dados.descricao, new Date(), new Date())
        try {
            await Api.put(`/api/grades/${id}`, grade);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/grades/${id}`);
        } catch (error) {
            console.log(error);
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: IValidator): Promise<boolean | Error> => {
        try {
            const { data } = await Api.post("/api/grades/validate", dados);
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

export default ControllerGrades;
