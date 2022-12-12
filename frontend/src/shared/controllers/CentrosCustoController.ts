import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { ICentrosCusto, IDetalhesCentrosCusto, TListaCentrosCusto, IValidator } from '../interfaces/entities/CentrosCusto';
import CentrosCusto from '../models/entities/CentrosCusto';
import { IController } from './../interfaces/controllers/Controller';

class ControllerCentrosCusto implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaCentrosCusto | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/centroscusto?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = 'api/centroscusto?_page=all'

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

    getOne = async (id: number): Promise<ICentrosCusto | Error> => {
        try {

            const { data } = await Api.get(`/api/centroscusto/${id}`);
    
            if (data) {
                return data;
            }
    
            return new Error('Erro ao consultar o registros.');
    
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }         
    }

    create = async (dados: Omit<IDetalhesCentrosCusto, 'id'>): Promise<number | undefined | Error> => {
        let centrocusto = new CentrosCusto(0, dados.descricao, new Date(), new Date());
        try {
            const { data } = await Api.post<ICentrosCusto>('/api/centroscusto', centrocusto);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesCentrosCusto): Promise<void | Error> => {
        let centrocusto = new CentrosCusto(id, dados.descricao, new Date(), new Date())
        try {
            await Api.put(`/api/centroscusto/${id}`, centrocusto);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/centroscusto/${id}`);
        } catch (error) {
            return new Error((error as {message:string; response: any}).response.data.detail || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: IValidator): Promise<boolean | Error> => {
        console.log(dados);
        try {
            const { data } = await Api.post("/api/centroscusto/validate", dados);
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

export default ControllerCentrosCusto;
