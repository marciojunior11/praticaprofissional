import { IFornecedores } from './../fornecedores/FornecedoresService';
import { ITiposProduto } from './../tiposProduto/TiposProdutoService';
import { Environment } from "../../../environment";
import { Api } from "../axios-config";
import { ICidades } from '../cidades/CidadesService';

export interface IProdutos {
    id: number,
    descricao: string,
    valorCompra: number,
    valorVenda: number,
    tipoProduto: ITiposProduto,
    fornecedor: IFornecedores
}

export interface IDetalhesProdutos {
    id: number,
    descricao: string,
    valorCompra: number | undefined,
    valorVenda: number | undefined,
    tipoProduto: ITiposProduto | undefined,
    fornecedor: IFornecedores
}

type TListaProdutos = {
    data: IProdutos[];
    qtd: number;
}

const getAll = async (page?: number, filter = ''): Promise<TListaProdutos | Error> => {
    try {
        var urlRelativa = '';
        if (page != 0) urlRelativa = `/api/produtos?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
        else urlRelativa = `api/produtos?_page=all`;
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
};

const getById = async (id : number): Promise<IProdutos | Error> => {
    try {

        const { data } = await Api.get(`/api/produtos/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
    }    
}

const create = async (dados: Omit<IDetalhesProdutos, 'id'>): Promise<number | undefined | Error> => {
    try {
        const { data } = await Api.post<IProdutos>('/api/produtos', dados);
        if (data) {
            return data.id;
        }
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
    }     
}

const updateById = async (id : number, dados : IDetalhesProdutos): Promise<void | Error> => {
    try {
        await Api.put(`/api/produtos/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
    }        
}

const deleteById = async (id : number): Promise<void | Error> => {
    try {
        await Api.delete(`/api/produtos/${id}`);
    } catch (error) {
        console.error('ERRO', error);
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
    }      
}

const validate = async (dados: Omit<IDetalhesProdutos, 'id'>): Promise<boolean | Error> => {
    try {
        const { data } = await Api.post(`/api/produtos/validate`, dados);
        console.log(data);
        if (data != 0) {
            return false;
        } else {
            return true;
        }
        
    } catch (error) {
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');    
    }
}

export const ProdutosService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    validate,
};