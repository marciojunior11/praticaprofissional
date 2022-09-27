import { IPaises } from './../interfaces/entities/Paises';
import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { ICidades, IDetalhesCidades, TListaCidades } from '../interfaces/entities/Cidades';
import Cidades from '../models/entities/Cidades';
import Estados from '../models/entities/Estados';
import Paises from '../models/entities/Paises';
import { IController } from './../interfaces/controllers/Controller';

class ControllerCidades implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaCidades | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/cidades?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = `api/cidades?_page=all`;
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

    getOne = async (id: number): Promise<ICidades | Error> => {
        try {
            const { data } = await Api.get(`/api/cidades/${id}`);
            if (data) {
                return data;
            }
            return new Error('Erro ao consultar o registros.');
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }        
    }

    create = async (dados: Omit<IDetalhesCidades, 'id'>): Promise<number | undefined | Error> => {
        let pais = new Paises()
        let estado = new Estados(dados.estado.id, dados.estado.nmestado, dados.estado.uf, pais, new Date(), new Date());
        let cidade = new Cidades(0, dados.nmcidade, dados.ddd, estado, new Date(), new Date());
        try {
            const { data } = await Api.post<ICidades>('/api/cidades', cidade);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesCidades): Promise<void | Error> => {
        let pais = new Paises();
        let estado = new Estados(dados.estado.id, dados.estado.nmestado, dados.estado.uf, pais, new Date(), new Date());
        let cidade = new Cidades(id, dados.nmcidade, dados.ddd, estado, new Date(), new Date());
        try {
            await Api.put(`/api/cidades/${id}`, cidade);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/cidades/${id}`);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: Omit<IDetalhesCidades, 'id'>): Promise<boolean | Error> => {
        try {
            const { data } = await Api.post(`/api/cidades/validate`, dados);
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

export default ControllerCidades;