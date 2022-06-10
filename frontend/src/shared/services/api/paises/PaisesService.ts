import { RestorePageOutlined } from "@mui/icons-material";
import { Environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IPaises {
    id: number;
    pais: string;
    sigla: string;
}

export interface IDetalhesPaises {
    id: number;
    pais: string;
    sigla: string;
}

type TListaPaises = {
    data: IPaises[];
    qtd: number;
}

const getAll = async (page = 1, filter = ''): Promise<TListaPaises | Error> => {
    try {

        const urlRelativa = `/api/paises?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

        const response = await Api.get(urlRelativa);

        if (response) {
            return {
                data: response.data.rows,
                qtd: response.data.rowCount
            };
        }

        return new Error('Erro ao listar os registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao listar os registros.');
    }
};

const getById = async (id : number): Promise<IPaises | Error> => {
    try {

        const { data } = await Api.get(`/api/paises/${id}`);

        if (data) {
            return data;
        }

        return new Error('Erro ao consultar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao consultar o registros.');
    }    
}

const create = async (dados : Omit<IPaises, 'id'>): Promise<number | Error> => {
    try {

        const { data } = await Api.post<IPaises>('/clientes', dados);

        if (data) {
            return data.id;
        }

        return new Error('Erro ao criar o registros.');

    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao criar o registros.');
    }     
}

const updateById = async (id : number, dados : IPaises): Promise<void | Error> => {
    try {
        await Api.put(`/clientes/${id}`, dados);
    } catch (error) {
        console.error(error);
        return new Error((error as {message:string}).message || 'Erro ao atualizar o registros.');
    }        
}

const deleteById = async (id : number): Promise<void | Error> => {
    try {
        const response = await Api.delete('/api/paises/'+id);
        console.log(response);
    } catch (error) {
        console.error('ERRO', error);
        return new Error((error as {message:string}).message || 'Erro ao apagar o registros.');
    }      
}

export const PaisesService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
};