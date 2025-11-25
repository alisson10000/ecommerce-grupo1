import axios from 'axios';

const BASE_URL = 'https://69245cb43ad095fb8473e61e.mockapi.io/backup';

export type Cliente = {
    id?: string; // ID do MockAPI (gerado automaticamente)
    clienteId: number; // ID original da API Spring Boot
    nome: string;
    cpf: string;
    email: string;
    endereco: string;
    dataCadastro: string | Date;
};

const mockApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getClientes = async (): Promise<Cliente[]> => {
    try {
        const response = await mockApi.get('/clientes');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar clientes do MockAPI:', error);
        throw error;
    }
};

export const getClienteById = async (id: string): Promise<Cliente> => {
    try {
        const response = await mockApi.get(`/clientes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar cliente ${id} do MockAPI:`, error);
        throw error;
    }
};

export const createCliente = async (cliente: Omit<Cliente, 'id'>): Promise<Cliente> => {
    try {
        const response = await mockApi.post('/clientes', cliente);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar cliente no MockAPI:', error);
        throw error;
    }
};

export const updateCliente = async (id: string, cliente: Partial<Cliente>): Promise<Cliente> => {
    try {
        const response = await mockApi.put(`/clientes/${id}`, cliente);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar cliente ${id} no MockAPI:`, error);
        throw error;
    }
};

export const deleteCliente = async (id: string): Promise<void> => {
    try {
        await mockApi.delete(`/clientes/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar cliente ${id} do MockAPI:`, error);
        throw error;
    }
};
