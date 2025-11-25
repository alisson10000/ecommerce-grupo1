import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Cliente, getClientes as getClientesMock, createCliente as createClienteMock, updateCliente as updateClienteMock } from '../api/mockApi';

const SPRING_API_URL = 'http://localhost:8080/api'; // Ajustar quando a URL real estiver disponível

type SyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface ClienteContextData {
    clientes: Cliente[];
    syncStatus: SyncStatus;
    lastSync: Date | null;
    loadClientes: () => Promise<void>;
    addCliente: (cliente: Omit<Cliente, 'id' | 'clienteId'>) => Promise<void>;
    updateCliente: (id: number, cliente: Partial<Cliente>) => Promise<void>;
    syncClientes: () => Promise<void>;
    restoreBackup: () => Promise<void>;
    backupClientes: Cliente[]; // Clientes vindos do backup
    checkBackupDifferences: () => Promise<{ localOnly: number; backupOnly: number; conflicts: number }>;
}

const ClienteContext = createContext<ClienteContextData>({} as ClienteContextData);

export const ClienteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [backupClientes, setBackupClientes] = useState<Cliente[]>([]);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [lastSync, setLastSync] = useState<Date | null>(null);

    useEffect(() => {
        loadClientesFromStorage();
    }, []);

    const loadClientesFromStorage = async () => {
        try {
            const storedClientes = await AsyncStorage.getItem('@clientes');
            if (storedClientes) {
                setClientes(JSON.parse(storedClientes));
            }
            const storedLastSync = await AsyncStorage.getItem('@lastSync');
            if (storedLastSync) {
                setLastSync(new Date(storedLastSync));
            }
        } catch (error) {
            console.error('Erro ao carregar clientes do storage:', error);
        }
    };

    const saveClientesToStorage = async (newClientes: Cliente[]) => {
        try {
            await AsyncStorage.setItem('@clientes', JSON.stringify(newClientes));
            setClientes(newClientes);
        } catch (error) {
            console.error('Erro ao salvar clientes no storage:', error);
        }
    };

    const fetchSpringClientes = async (): Promise<Cliente[]> => {




        console.warn('Usando dados locais simulando API Spring Boot');
        return clientes;
    };

    const loadClientes = async () => {
        setSyncStatus('loading');
        try {
            const springClientes = await fetchSpringClientes();
            await saveClientesToStorage(springClientes);
            setSyncStatus('success');
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            setSyncStatus('error');
        }
    };

    const addCliente = async (clienteData: Omit<Cliente, 'id' | 'clienteId'>) => {
        try {




            const newCliente: Cliente = {
                ...clienteData,
                clienteId: Date.now(), // ID temporário
                id: undefined // ID do MockAPI será gerado lá
            };

            const newClientes = [...clientes, newCliente];
            await saveClientesToStorage(newClientes);

            syncSingleClienteToMock(newCliente);

        } catch (error) {
            console.error('Erro ao adicionar cliente:', error);
            throw error;
        }
    };

    const updateCliente = async (clienteId: number, clienteData: Partial<Cliente>) => {
        try {



            const newClientes = clientes.map(c =>
                c.clienteId === clienteId ? { ...c, ...clienteData } : c
            );
            await saveClientesToStorage(newClientes);


        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    };

    const syncSingleClienteToMock = async (cliente: Cliente) => {
        try {
            await createClienteMock(cliente);
        } catch (error) {
            console.error('Erro ao sincronizar cliente individual com MockAPI:', error);
        }
    };

    const syncClientes = async () => {
        setSyncStatus('loading');
        console.log('Iniciando sincronização...');
        const startTime = Date.now();

        try {

            const springClientes = await fetchSpringClientes();

            await saveClientesToStorage(springClientes);


            const mockClientes = await getClientesMock();
            setBackupClientes(mockClientes);

            let syncedCount = 0;

            for (const localCliente of springClientes) {
                const existsInMock = mockClientes.find(mc => mc.clienteId === localCliente.clienteId);

                if (existsInMock) {
                    if (existsInMock.id) {
                        await updateClienteMock(existsInMock.id, localCliente);
                    }
                } else {
                    await createClienteMock(localCliente);
                }
                syncedCount++;
            }

            const now = new Date();
            setLastSync(now);
            await AsyncStorage.setItem('@lastSync', now.toISOString());
            setSyncStatus('success');

            console.log(`Sincronização finalizada em ${(Date.now() - startTime) / 1000}s. ${syncedCount} clientes processados.`);

        } catch (error) {
            console.error('Erro na sincronização:', error);
            setSyncStatus('error');
            throw error;
        }
    };

    const restoreBackup = async () => {
        setSyncStatus('loading');
        try {
            const mockClientes = await getClientesMock();


            await saveClientesToStorage(mockClientes);
            setBackupClientes(mockClientes);
            setSyncStatus('success');
        } catch (error) {
            console.error('Erro ao restaurar backup:', error);
            setSyncStatus('error');
            throw error;
        }
    };

    const checkBackupDifferences = async () => {
        try {
            const mockClientes = await getClientesMock();
            setBackupClientes(mockClientes);

            const localIds = new Set(clientes.map(c => c.clienteId));
            const backupIds = new Set(mockClientes.map(c => c.clienteId));

            const localOnly = clientes.filter(c => !backupIds.has(c.clienteId)).length;
            const backupOnly = mockClientes.filter(c => !localIds.has(c.clienteId)).length;

            let conflicts = 0;
            clientes.forEach(c => {
                const backup = mockClientes.find(b => b.clienteId === c.clienteId);
                if (backup && backup.nome !== c.nome) {
                    conflicts++;
                }
            });

            return { localOnly, backupOnly, conflicts };
        } catch (error) {
            console.error('Erro ao verificar diferenças:', error);
            return { localOnly: 0, backupOnly: 0, conflicts: 0 };
        }
    };

    return (
        <ClienteContext.Provider value={{
            clientes,
            syncStatus,
            lastSync,
            loadClientes,
            addCliente,
            updateCliente,
            syncClientes,
            restoreBackup,
            backupClientes,
            checkBackupDifferences
        }}>
            {children}
        </ClienteContext.Provider>
    );
};

export function useClientes() {
    const context = useContext(ClienteContext);
    if (!context) {
        throw new Error('useClientes deve ser usado dentro de um ClienteProvider');
    }
    return context;
}
