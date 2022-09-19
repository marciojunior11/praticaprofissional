import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IEstados, IDetalhesEstados, TListaEstados } from '../interfaces/entities/Estados';
import Estados from '../models/entities/Estados';
import Paises from '../models/entities/Paises';
import { IController } from './../interfaces/controllers/Controller';

class ControllerEstados implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaEstados | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/estados?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = `api/estados?_page=all`;
            console.log(urlRelativa)
    
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

    getOne = async (id: number): Promise<IEstados | Error> => {
        try {

            const { data } = await Api.get(`/api/estados/${id}`);
    
            if (data) {
                return data;
            }
    
            return new Error('Erro ao consultar o registros.');
    
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }        
    }

    create = async (dados: Omit<IDetalhesEstados, 'id'>): Promise<number | undefined | Error> => {
        let pais = new Paises(dados.pais.id, dados.pais.nmpais, dados.pais.sigla, dados.pais.ddi, new Date(), new Date());
        let estado = new Estados(0, dados.nmestado, dados.uf, pais, new Date(), new Date());
        try {
            const { data } = await Api.post<IEstados>('/api/estados', estado);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesEstados): Promise<void | Error> => {
        let pais = new Paises(dados.pais.id, dados.pais.nmpais, dados.pais.sigla, dados.pais.ddi, new Date(), new Date());
        let estado = new Estados(id, dados.nmestado, dados.uf, pais, new Date(), new Date());
        try {
            await Api.put(`/api/estados/${id}`, estado);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/estados/${id}`);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: Omit<IDetalhesEstados, 'id'>): Promise<boolean | Error> => {
        try {
            const { data } = await Api.post(`/api/estados/validate`, dados);
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

export default ControllerEstados;