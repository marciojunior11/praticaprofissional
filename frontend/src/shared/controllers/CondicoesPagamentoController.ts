import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { ICondicoesPagamento, IDetalhesCondicoesPagamento, TListaCondicoesPagamento } from '../interfaces/entities/CondicoesPagamento';
import { IValidator } from '../interfaces/entities/CondicoesPagamento';
import CondicoesPagamento from '../models/entities/CondicoesPagamento';
import Estados from '../models/entities/Estados';
import FormasPagamento from '../models/entities/FormasPagamento';
import Paises from '../models/entities/Paises';
import Parcelas from '../models/entities/Parcelas';
import { IController } from './../interfaces/controllers/Controller';

class ControllerCondicoesPagamento implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaCondicoesPagamento | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/condicoespagamento?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = `api/condicoespagamento?_page=all`;
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

    getOne = async (id: number): Promise<ICondicoesPagamento | Error> => {
        try {
            const { data } = await Api.get(`/api/condicoespagamento/${id}`);
            if (data) {
                return data;
            }
            return new Error('Erro ao consultar o registros.');
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }        
    }

    create = async (dados: Omit<IDetalhesCondicoesPagamento, 'flsituacao'>): Promise<number | undefined | Error> => {
        var listaparcelas = new Array<Parcelas>();
        for (let i = 0; i < dados.listaparcelas.length; i++) {
            let formapagamento = new FormasPagamento(
                dados.listaparcelas[i].formapagamento.id,
                dados.listaparcelas[i].formapagamento.descricao,
                dados.listaparcelas[i].formapagamento.datacad,
                dados.listaparcelas[i].formapagamento.ultalt
            );
            let parcela = new Parcelas(
                dados.listaparcelas[i].numero, 
                dados.listaparcelas[i].dias, 
                dados.listaparcelas[i].percentual, 
                formapagamento,
            );
            listaparcelas.push(parcela);
        }
        let condicaopagamento = new CondicoesPagamento(
            0,
            dados.descricao,
            dados.txdesc,
            dados.txmulta,
            dados.txjuros,
            listaparcelas,
            "A",
            new Date(),
            new Date()
        );
        try {
            const { data } = await Api.post<ICondicoesPagamento>('/api/condicoespagamento', condicaopagamento);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesCondicoesPagamento): Promise<void | Error> => {
        var listaparcelas = new Array<Parcelas>();
        for (let i = 0; i < dados.listaparcelas.length; i++) {
            let formapagamento = new FormasPagamento(
                dados.listaparcelas[i].formapagamento.id,
                dados.listaparcelas[i].formapagamento.descricao,
                dados.listaparcelas[i].formapagamento.datacad,
                dados.listaparcelas[i].formapagamento.ultalt
            );
            let parcela = new Parcelas(
                dados.listaparcelas[i].numero, 
                dados.listaparcelas[i].dias, 
                dados.listaparcelas[i].percentual, 
                formapagamento,
            );
            listaparcelas.push(parcela);
        }
        console.log("ID", id);
        let condicaopagamento = new CondicoesPagamento(
            id,
            dados.descricao,
            dados.txdesc,
            dados.txmulta,
            dados.txjuros,
            listaparcelas,
            dados.flsituacao,
            new Date(),
            new Date()
        );
        try {
            await Api.put(`/api/condicoespagamento/${id}`, condicaopagamento);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/condicoespagamento/${id}`);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: Omit<IValidator, 'id'>): Promise<boolean | Error> => {
        console.log('aqui');
        try {
            const { data } = await Api.post(`/api/condicoespagamento/validate`, dados);
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

export default ControllerCondicoesPagamento;