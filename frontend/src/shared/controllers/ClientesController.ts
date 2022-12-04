import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IClientes, IDetalhesClientes, TListaClientes, IValidator } from '../interfaces/entities/Clientes';
import Cidades from '../models/entities/Cidades';
import CondicoesPagamento from '../models/entities/CondicoesPagamento';
import Estados from '../models/entities/Estados';
import FormasPagamento from '../models/entities/FormasPagamento';
import Fisicas from '../models/entities/Fisicas';
import Parcelas from '../models/entities/Parcelas';
import { IController } from './../interfaces/controllers/Controller';

class ControllerClientes implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaClientes | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/clientes?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = 'api/clientes?_page=all'
    
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

    getOne = async (id: number): Promise<IClientes | Error> => {
        try {

            const { data } = await Api.get(`/api/clientes/${id}`);
    
            if (data) {
                return data;
            }
    
            return new Error('Erro ao consultar o registros.');
    
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }         
    }

    create = async (dados: Omit<IDetalhesClientes, 'flsituacao'>): Promise<number | undefined | Error> => {
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
        let cliente = new Fisicas(
            0,
            dados.nmcliente,
            dados.sexo,
            dados.cpf,
            dados.rg,
            dados.datanasc,
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
            'N',
            new Date(),
            new Date()
        );
        console.log(cliente);
        try {
            const { data } = await Api.post<IClientes>('/api/clientes', cliente);
            if (data) {
                return data.id;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesClientes): Promise<void | Error> => {
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
        let fornecedor = new Fisicas(
            id,
            dados.nmcliente,
            dados.sexo,
            dados.cpf,
            dados.rg,
            dados.datanasc,
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
            dados.flassociado,
            new Date(),
            new Date()
        );
        try {
            await Api.put(`/api/clientes/${id}`, fornecedor);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/clientes/${id}`);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: Omit<IValidator, 'id'>): Promise<boolean | Error> => {
        try {
            const { data } = await Api.post(`/api/clientes/validate`, dados);
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

export default ControllerClientes;
