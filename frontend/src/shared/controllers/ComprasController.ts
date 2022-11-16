import { Api } from '../../api/axios-config'
import { Environment } from '../environment';
import { IControllerCompras } from '../interfaces/controllers/ControllerCompras';
import { ICompras, IDetalhesCompras, TListaCompras } from '../interfaces/entities/Compras';
import { IValidator } from '../interfaces/entities/Compras';
import CentrosCusto from '../models/entities/CentrosCusto';
import Compras from '../models/entities/Compras';
import ContasPagar from '../models/entities/ContasPagar';
import Estados from '../models/entities/Estados';
import FormasPagamento from '../models/entities/FormasPagamento';
import Juridicas from '../models/entities/Juridicas';
import Paises from '../models/entities/Paises';
import Parcelas from '../models/entities/Parcelas';
import Produtos from '../models/entities/Produtos';
import ProdutosNF from '../models/entities/ProdutosNF';
import Variacoes from '../models/entities/Variacoes';

class ControllerCompras implements IControllerCompras {

    constructor() {

    }

    getAll = async (page?: number, filter = ''): Promise<TListaCompras | Error> => {
        try {
            var urlRelativa = '';
            if (page != 0) urlRelativa = `/api/compras?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
            else urlRelativa = `api/compras?_page=all`;
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

    getOne = async (dados: IValidator): Promise<ICompras | Error> => {
        try {
            const urlRelativa = `api/compras/?numnf=${dados.numnf}_serienf=${dados.serienf}_modelonf=${dados.modelonf}_idfornecedor=${dados.idfornecedor}`
            const { data } = await Api.get(urlRelativa);
            if (data) {
                return data;
            }
            return new Error('Erro ao consultar o registros.');
        } catch (error) {
            console.error(error);
            return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
        }        
    }

    create = async (dados: IDetalhesCompras): Promise<number | undefined | Error> => {
        var listaprodutos = new Array<Produtos>();
        var listacontaspagar = new Array<ContasPagar>();
        var listaprodutosAux = dados.listaprodutos;
        var listaParcelasAux = dados.condicaopagamento.listaparcelas;
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
                produto.vlfrete,
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
        });
        listaParcelasAux.forEach((parcela) => {
            let dtvencimento = new Date(dados.dataemissao);
            dtvencimento.setDate(dtvencimento.getDate() + parcela.dias);
            let vlconta = (dados.vltotal/100)*parcela.percentual;
            let conta = new ContasPagar(
                parcela.numero,
                dtvencimento,
                vlconta,
                dados.condicaopagamento.txdesc,
                dados.condicaopagamento.txmulta,
                dados.condicaopagamento.txjuros,
                new Juridicas(dados.fornecedor.id),
                new FormasPagamento(parcela.formapagamento.id),
                new CentrosCusto(1),
                'A',
                new Date(),
                new Date()
            );
            listacontaspagar.push(conta);
        })
        var compra = new Compras(
            dados.numnf,
            dados.serienf,
            dados.modelonf,
            new Juridicas(dados.fornecedor.id),
            dados.observacao,
            dados.vltotal,
            listaprodutos,
            listacontaspagar,
            'A',
            dados.dataemissao,
            dados.dataentrada,
            new Date(),
            new Date()
        )

        try {
            const { data } = await Api.post<ICompras>('/api/compras', compra);
            if (data) {
                return;
            }
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
        }  
    }

    update = async (dados: IDetalhesCompras): Promise<void | Error> => {
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
                produto.vlfrete,
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
        var compra = new Compras(
            dados.numnf,
            dados.serienf,
            dados.modelonf,
            new Juridicas(dados.fornecedor.id),
            dados.observacao,
            dados.vltotal,
            listaprodutos,
            new Array<ContasPagar>(),
            dados.flsituacao,
            dados.dataemissao,
            dados.dataentrada,
            new Date(),
            new Date()
        )
        try {
            await Api.put(`/api/compras/api/compras/numnf=${dados.numnf}_serienf=${dados.serienf}_modelonf=${dados.modelonf}_idfornecedor=${dados.fornecedor.id}`, compra);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
        }  
    }

    delete = async (dados: IValidator): Promise<void | Error> => {
        try {
            const url = `/api/compras/?_numnf=${dados.numnf}&_serienf=${dados.serienf}&_modelonf=${dados.modelonf}&_idfornecedor=${dados.idfornecedor}`
            await Api.delete(url);
        } catch (error) {
            return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
        }           
    }

    validate = async (dados: IValidator): Promise<boolean | Error> => {
        try {
            const { data } = await Api.post(`/api/compras/validate`, dados);
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

export default ControllerCompras;