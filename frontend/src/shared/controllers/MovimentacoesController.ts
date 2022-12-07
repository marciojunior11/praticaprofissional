import { TListaMovimentacoes } from './../interfaces/entities/Movimentacoes';
import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IControllerMovimentacoes } from '../interfaces/controllers/ControllerMovimentacoes';
import { IGrades, IDetalhesGrades, TListaGrades, IValidator } from '../interfaces/entities/Grades';
import Grades from '../models/entities/Grades';
import { IController } from './../interfaces/controllers/Controller';

class ControllerGrades implements IControllerMovimentacoes {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaMovimentacoes | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/movimentacoes?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
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
}

export default ControllerGrades;
