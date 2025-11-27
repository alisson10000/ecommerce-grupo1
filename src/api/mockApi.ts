import axios from 'axios';

const mockApi = axios.create({
    baseURL: 'https://69245cb43ad095fb8473e61e.mockapi.io/backup',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export type Cliente = {
    id?: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    numero: string;
    complemento?: string;
    endereco_id?: number;
    endereco?: {
        id: number;
        logradouro: string;
        bairro: string;
        cidade: string;
        uf: string;
        cep: string;
    };
};

export const getClientes = async (): Promise<Cliente[]> => {
    try {
        const response = await mockApi.get('/clientes');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
    }
};

export const createCliente = async (cliente: Cliente): Promise<Cliente> => {
    try {
        const response = await mockApi.post('/clientes', cliente);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        throw error;
    }
};

export const updateCliente = async (id: string, cliente: Partial<Cliente>): Promise<Cliente> => {
    try {
        const response = await mockApi.put(`/clientes/${id}`, cliente);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
    }
};

export const deleteCliente = async (id: string): Promise<void> => {
    try {
        await mockApi.delete(`/clientes/${id}`);
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        throw error;
    }
};