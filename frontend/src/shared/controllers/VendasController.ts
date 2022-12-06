import { IContasReceber } from './../interfaces/entities/ContasReceber';
import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IControllerVendas } from '../interfaces/controllers/ControllerVendas';
import { IVendas, IDetalhesVendas, TListaVendas } from '../interfaces/entities/Vendas';
import { IValidator } from '../interfaces/entities/Vendas';
import { IContasPagar } from '../interfaces/entities/ContasPagar';
import CentrosCusto from '../models/entities/CentrosCusto';
import Vendas from '../models/entities/Vendas';
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

class ControllerVendas implements IControllerVendas {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaVendas | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/vendas?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
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

    getOne = async (id: number): Promise<IVendas | Error> => {
        try {
            const { data } = await Api.get(`/api/vendas/${id}`);
            if (data) {
                return data;
            }
            return new Error('Erro ao consultar o registros.');
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }        
    }

    create = async (dados: IDetalhesVendas): Promise<number | undefined | Error> => {
        console.log('controller');
        console.log(dados);

        var listaprodutos = new Array<Produtos>();
        var listacontasreceber = new Array<ContasReceber>();
        var listaprodutosAux = dados.listaprodutos;
        var listacontasreceberAux = dados.listacontasreceber;

        listaprodutosAux.forEach((produto) => {
            let listavariacoes = new Array<Variacoes>();
            produto.listavariacoes.forEach((variacao) => {
                let mVariacao = new Variacoes(variacao.id);
                listavariacoes.push(mVariacao);
            });
            let itemNF = new ProdutosNF(
                produto.id,
                produto.gtin,
                produto.descricao,
                produto.apelido,
                produto.marca,
                produto.undmedida,
                produto.unidade,
                produto.vlcusto,
                produto.vlcompra,
                produto.vlvenda,
                produto.lucro,
                produto.pesoliq,
                produto.pesobruto,
                produto.ncm,
                produto.cfop,
                produto.percicmssaida,
                produto.percipi,
                produto.cargatribut,
                produto.qtdatual - produto.qtd,
                produto.qtdideal,
                produto.qtdmin,
                new Juridicas(produto.fornecedor.id),
                listavariacoes,
                produto.qtd,
                produto.vltotal,
                produto.datacad,
                new Date()
            );
                listaprodutos.push(itemNF);
        });

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
                'V',
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
            dados.observacao,
            dados.vltotal,
            listaprodutos,
            listacontasreceber,
            'A',
            dados.dataemissao,
            new Date(),
            new Date()
        )

        try {
            const { data } = await Api.post<IVendas>('/api/vendas', venda);
            if (data) {
                return;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (id: number, dados: IDetalhesVendas): Promise<void | Error> => {
        var listaprodutos = new Array<Produtos>();
        var listaprodutosAux = dados.listaprodutos;
        listaprodutosAux.forEach((produto) => {
            let listavariacoes = new Array<Variacoes>();
            produto.listavariacoes.forEach((variacao) => {
                let mVariacao = new Variacoes(variacao.id);
                listavariacoes.push(mVariacao);
            });
            let itemNF = new ProdutosNF(
                produto.id,
                produto.gtin,
                produto.descricao,
                produto.apelido,
                produto.marca,
                produto.undmedida,
                produto.unidade,
                produto.vlcusto,
                produto.vlcompra,
                produto.vlvenda,
                produto.lucro,
                produto.pesoliq,
                produto.pesobruto,
                produto.ncm,
                produto.cfop,
                produto.percicmssaida,
                produto.percipi,
                produto.cargatribut,
                produto.qtdatual,
                produto.qtdideal,
                produto.qtdmin,
                new Juridicas(produto.fornecedor.id),
                listavariacoes,
                produto.qtd,
                produto.vltotal,
                produto.datacad,
                produto.ultalt
            );
                listaprodutos.push(itemNF);
        })
        var venda = new Vendas(
            id,
            new Fisicas(dados.cliente.id),
            new CondicoesPagamento(dados.condicaopagamento.id),
            dados.observacao,
            dados.vltotal,
            listaprodutos,
            new Array<ContasReceber>(),
            dados.flsituacao,
            dados.dataemissao,
            new Date(),
            new Date()
        )
        try {
            await Api.put(`/api/clientes/${id}`, venda);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (id: number): Promise<void | Error> => {
        try {
            await Api.delete(`/api/clientes/${id}`);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao areceber o registros.');
        }           
    }

    receberConta = async (dados: IContasReceber): Promise<void | Error> => {
        try {
            const { data } = await Api.put('/api/vendas/receberconta', dados);
            if (data) {
                return data;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao receber a conta.');
        }
    }

    validate = async (dados: IValidator): Promise<boolean | Error> => {
        try {
            const { data } = await Api.post(`/api/vendas/validate`, dados);
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

export default ControllerVendas;