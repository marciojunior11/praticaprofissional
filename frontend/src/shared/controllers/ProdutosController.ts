import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IProdutos, IDetalhesProdutos, TListaProdutos, IValidator } from '../interfaces/entities/Produtos';
import Caracteristicas from '../models/entities/Caracteristicas';
import Juridicas from '../models/entities/Juridicas';
import Produtos from '../models/entities/Produtos';
import Variacoes from '../models/entities/Variacoes';
import { IController } from './../interfaces/controllers/Controller';

class ControllerProdutos implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaProdutos | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/produtos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = 'api/produtos?_page=all'
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

    getOne = async (id: number): Promise<IProdutos | Error> => {
        try {

            const { data } = await Api.get(`/api/produtos/${id}`);
    
            console.log('data', data);

            if (data) {
                return data;
            }
    
            return new Error('Erro ao consultar o registros.');
    
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }         
    }

    create = async (dados: Omit<IDetalhesProdutos, 'id'>): Promise<number | undefined | Error> => {
        let fornecedor = new Juridicas();
        fornecedor._id = dados.fornecedor.id;
        var listavariacoes = new Array<Variacoes>();
        for (let i = 0; i < dados.listavariacoes.length; i++) {
            let caracteristica = new Caracteristicas();
            caracteristica._id = dados.listavariacoes[i].caracteristica.id;
            let variacao = new Variacoes(
                dados.listavariacoes[i].id, 
                dados.listavariacoes[i].descricao, 
                caracteristica,
                dados.listavariacoes[i].datacad,
                dados.listavariacoes[i].ultalt,
            );
            listavariacoes.push(variacao);
        }
        let produto = new Produtos(
            0,
            dados.gtin,
            dados.descricao,
            dados.apelido,
            dados.marca,
            dados.undmedida,
            dados.unidade,
            0,
            0,
            0,
            0,
            dados.pesoliq,
            dados.pesobruto,
            dados.ncm,
            dados.cfop,
            dados.percicmssaida,
            dados.percipi,
            dados.cargatribut,
            0,
            0,
            dados.qtdideal,
            dados.qtdmin,
            fornecedor,
            listavariacoes,
            new Date(),
            new Date()
        );
        try {
            const { data } = await Api.post<IProdutos>('/api/produtos', produto);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesProdutos): Promise<void | Error> => {
        let fornecedor = new Juridicas();
        fornecedor._id = dados.fornecedor.id;
        var listavariacoes = new Array<Variacoes>();
        for (let i = 0; i < dados.listavariacoes.length; i++) {
            let caracteristica = new Caracteristicas();
            caracteristica._id = dados.listavariacoes[i].caracteristica.id;
            let variacao = new Variacoes(
                dados.listavariacoes[i].id, 
                dados.listavariacoes[i].descricao, 
                caracteristica,
                dados.listavariacoes[i].datacad,
                dados.listavariacoes[i].ultalt,
            );
            listavariacoes.push(variacao);
        }
        let produto = new Produtos(
            id,
            dados.gtin,
            dados.descricao,
            dados.apelido,
            dados.marca,
            dados.undmedida,
            dados.unidade,
            dados.vlcusto,
            dados.vlcompra,
            dados.vlvenda,
            dados.lucro,
            dados.pesoliq,
            dados.pesobruto,
            dados.ncm,
            dados.cfop,
            dados.percicmssaida,
            dados.percipi,
            dados.cargatribut,
            dados.vlfrete,
            dados.qtdatual,
            dados.qtdideal,
            dados.qtdmin,
            fornecedor,
            listavariacoes,
            new Date(),
            new Date()
        );
        try {
            await Api.put(`/api/produtos/${id}`, produto);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/produtos/${id}`);
        } catch (error) {
            console.log(error);
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: IValidator): Promise<boolean | Error> => {
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

export default ControllerProdutos;
