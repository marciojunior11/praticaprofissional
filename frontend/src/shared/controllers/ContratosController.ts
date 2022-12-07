import { IValidator } from './../interfaces/entities/Contratos';
import { IContasReceber } from './../interfaces/entities/ContasReceber';
import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IContratos, IDetalhesContratos, TListaContratos } from '../interfaces/entities/Contratos';
import { IContasPagar } from '../interfaces/entities/ContasPagar';
import CentrosCusto from '../models/entities/CentrosCusto';
import Contratos from '../models/entities/Contratos';
import CondicoesPagamento from '../models/entities/CondicoesPagamento';
import ContasPagar from '../models/entities/ContasPagar';
import Estados from '../models/entities/Estados';
import FormasPagamento from '../models/entities/FormasPagamento';
import Juridicas from '../models/entities/Juridicas';
import Paises from '../models/entities/Paises';
import Parcelas from '../models/entities/Parcelas';
import Produtos from '../models/entities/Produtos';
import ProdutosNF from '../models/entities/ProdutosNF';
import Variacoes from '../models/entities/Variacoes';
import Fisicas from '../models/entities/Fisicas';
import ContasReceber from '../models/entities/ContasReceber';
import { IController } from '../interfaces/controllers/Controller';
import Vendas from '../models/entities/Vendas';

class ControllerContratos implements IController {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaContratos | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/contratos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = `api/vendas?_page=all`;
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

    getOne = async (id: number): Promise<IContratos | Error> => {
        try {
            const { data } = await Api.get(`/api/contratos/${id}`);
            if (data) {
                return data;
            }
            return new Error('Erro ao consultar o registros.');
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }        
    }

    create = async (dados: IDetalhesContratos): Promise<number | undefined | Error> => {
        var listacontasreceber = new Array<ContasReceber>();
        var listacontasreceberAux = dados.listacontasreceber;

        listacontasreceberAux.forEach((conta) => {
            let contareceber = new ContasReceber(
                conta.nrparcela,
                conta.percparcela,
                conta.dtvencimento,
                conta.vltotal,
                conta.txdesc,
                conta.txmulta,
                conta.txjuros,
                conta.observacao,
                new Fisicas(conta.cliente.id),
                new FormasPagamento(conta.formapagamento.id),
                conta.florigem,
                'A',
                conta.datacad,
                conta.ultalt
            );
            listacontasreceber.push(contareceber);
        })

        var venda = new Vendas(
            0,
            new Fisicas(dados.cliente.id),
            new CondicoesPagamento(dados.condicaopagamento.id),
            `Venda referente ao CONTRATO de associado do cliente ${dados.cliente.nmcliente}, referente ao mês ${new Date().getMonth()}, válido por ${dados.qtdmeses} meses.`,
            dados.vltotal,
            [],
            listacontasreceber,
            'A',
            new Date(),
            new Date(),
            new Date()
        );

        var contrato = new Contratos(
            0,
            new Fisicas(dados.cliente.id),
            new CondicoesPagamento(dados.condicaopagamento.id),
            venda,
            listacontasreceber,
            dados.qtdmeses,
            dados.vltotal,
            dados.datavalidade,
            dados.flsituacao,
            new Date(),
            new Date()
        );

        try {
            const { data } = await Api.post<IContratos>('/api/contratos', contrato);
            if (data) {
                return;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesContratos): Promise<void | Error> => {
        var contrato = new Contratos(
            id,
            new Fisicas(dados.cliente.id),
            new CondicoesPagamento(dados.condicaopagamento.id),
            new Vendas(),
            [],
            dados.qtdmeses,
            dados.vltotal,
            dados.datavalidade,
            dados.flsituacao,
            new Date(),
            new Date()
        );
        try {
            await Api.put(`/api/clientes/${id}`, contrato);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/contratos/${id}`);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao areceber o registros.');
        }           
    }

    validate = async (dados: IValidator): Promise<boolean | Error> => {
        try {
            const {data} = await Api.post(`/api/contratos/validate`, dados);
            if (data != 0) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao areceber o registros.');
        }     
    }
}

export default ControllerContratos;