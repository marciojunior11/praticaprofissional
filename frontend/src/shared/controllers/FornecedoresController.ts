import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IFornecedores, IDetalhesFornecedores, TListaFornecedores, IValidator } from '../interfaces/entities/Fornecedores';
import Cidades from '../models/entities/Cidades';
import CondicoesPagamento from '../models/entities/CondicoesPagamento';
import Estados from '../models/entities/Estados';
import FormasPagamento from '../models/entities/FormasPagamento';
import Juridicas from '../models/entities/Juridicas';
import Parcelas from '../models/entities/Parcelas';
import { IController } from './../interfaces/controllers/Controller';

class ControllerFornecedores implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaFornecedores | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/fornecedores?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = 'api/fornecedores?_page=all'
    
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

    getOne = async (id: number): Promise<IFornecedores | Error> => {
        try {

            const { data } = await Api.get(`/api/fornecedores/${id}`);
    
            if (data) {
                return data;
            }
    
            return new Error('Erro ao consultar o registros.');
    
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }         
    }

    create = async (dados: Omit<IDetalhesFornecedores, 'flsituacao'>): Promise<number | undefined | Error> => {
        console.log("DADOS", dados);
        let cidade = new Cidades(
            dados.cidade.id,
            dados.cidade.nmcidade,
            dados.cidade.ddd,
            new Estados(),
            dados.cidade.datacad,
            dados.cidade.ultalt
        );
        let listaparcelas = new Array<Parcelas>();
        let listaparcelasAux = dados.condicaopagamento.listaparcelas;
        console.log(listaparcelasAux);
        for (let i = 0; i < listaparcelasAux?.length!; i++) {
            let formapagamento = new FormasPagamento(
                listaparcelasAux?.[i].formapagamento.id,
                listaparcelasAux?.[i].formapagamento.descricao,
                listaparcelasAux?.[i].formapagamento.datacad,
                listaparcelasAux?.[i].formapagamento.ultalt
            );
            let parcela = new Parcelas(
                listaparcelasAux?.[i].numero, 
                listaparcelasAux?.[i].dias, 
                listaparcelasAux?.[i].percentual, 
                formapagamento,
            );
            listaparcelas.push(parcela);
        }
        let condicaopagamento = new CondicoesPagamento(
            dados.condicaopagamento.id,
            dados.condicaopagamento.descricao,
            dados.condicaopagamento.txdesc,
            dados.condicaopagamento.txmulta,
            dados.condicaopagamento.txjuros,
            listaparcelas,
            dados.condicaopagamento.flsituacao,
            dados.condicaopagamento.datacad,
            dados.condicaopagamento.ultalt
        );
        let fornecedor = new Juridicas(
            0, 
            dados.razsocial, 
            dados.nmfantasia, 
            dados.cnpj, 
            dados.inscestadual, 
            dados.email, 
            dados.telefone, 
            dados.celular, 
            dados.cep, 
            dados.endereco, 
            dados.numend, 
            dados.bairro, 
            cidade, 
            condicaopagamento, 
            'A', 
            new Date(),
            new Date()
        );
        try {
            const { data } = await Api.post<IFornecedores>('/api/fornecedores', fornecedor);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesFornecedores): Promise<void | Error> => {
        console.log("dados", dados.flsituacao);
        let cidade = new Cidades(
            dados.cidade.id,
            dados.cidade.nmcidade,
            dados.cidade.ddd,
            new Estados(),
            dados.cidade.datacad,
            dados.cidade.ultalt
        );
        let listaparcelas = new Array<Parcelas>();
        let listaparcelasAux = dados.condicaopagamento.listaparcelas;
        for (let i = 0; i < listaparcelasAux?.length!; i++) {
            let formapagamento = new FormasPagamento(
                listaparcelasAux?.[i].formapagamento.id,
                listaparcelasAux?.[i].formapagamento.descricao,
                listaparcelasAux?.[i].formapagamento.datacad,
                listaparcelasAux?.[i].formapagamento.ultalt
            );
            let parcela = new Parcelas(
                listaparcelasAux?.[i].numero, 
                listaparcelasAux?.[i].dias, 
                listaparcelasAux?.[i].percentual, 
                formapagamento,
            );
            listaparcelas.push(parcela);
        }
        let condicaopagamento = new CondicoesPagamento(
            dados.condicaopagamento.id,
            dados.condicaopagamento.descricao,
            dados.condicaopagamento.txdesc,
            dados.condicaopagamento.txmulta,
            dados.condicaopagamento.txjuros,
            listaparcelas,
            dados.condicaopagamento.flsituacao,
            dados.condicaopagamento.datacad,
            dados.condicaopagamento.ultalt
        );
        let fornecedor = new Juridicas(
            id, 
            dados.razsocial, 
            dados.nmfantasia, 
            dados.cnpj, 
            dados.inscestadual, 
            dados.email, 
            dados.telefone, 
            dados.celular, 
            dados.cep, 
            dados.endereco, 
            dados.numend, 
            dados.bairro, 
            cidade, 
            condicaopagamento,
            dados.flsituacao,
            new Date(),
            new Date()
        );
        try {
            await Api.put(`/api/fornecedores/${id}`, fornecedor);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/fornecedores/${id}`);
        } catch (error) {
            return new Error((error as {message:string; response: any}).response.data.detail || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: Omit<IValidator, 'id'>): Promise<boolean | Error> => {
        try {
            const { data } = await Api.post(`/api/fornecedores/validate`, dados);
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

export default ControllerFornecedores;
