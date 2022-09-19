import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IPaises, IDetalhesPaises, TListaPaises } from '../interfaces/entities/Paises';
import Paises from '../models/entities/Paises';
import { IController } from './../interfaces/controllers/Controller';

class ControllerPaises implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaPaises | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/paises?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = 'api/paises?_page=all'
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
    }

    getOne = async (id: number): Promise<IPaises | Error> => {
        try {

            const { data } = await Api.get(`/api/paises/${id}`);
    
            if (data) {
                return data;
            }
    
            return new Error('Erro ao consultar o registros.');
    
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }         
    }

    create = async (dados: Omit<IDetalhesPaises, 'id'>): Promise<number | undefined | Error> => {
        let pais = new Paises(0, dados.nmpais, dados.sigla, dados.ddi, new Date(), new Date());
        try {
            const { data } = await Api.post<IPaises>('/api/paises', pais);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesPaises): Promise<void | Error> => {
        let pais = new Paises(id, dados.nmpais, dados.sigla, dados.ddi, new Date(), new Date())
        try {
            await Api.put(`/api/paises/${id}`, pais);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/paises/${id}`);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (filter: string): Promise<boolean | Error> => {
        try {
            const { data } = await Api.get(`/api/paises?_filter=${filter}`);
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

export default ControllerPaises;
