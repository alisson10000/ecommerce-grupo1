import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from "../../api/api"; // 👈 Importa a instância configurada do Axios

// ------------------------------------
// 1. INTERFACES (ATUALIZADA)
// ------------------------------------

interface User {
  email: string;
  name: string;
  id: number; // 👈 Adicionando o ID (será o vendedor_id)
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ------------------------------------
// 2. PROVIDER
// ------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@userToken');
      const storedName = await AsyncStorage.getItem('@userName');
      const storedEmail = await AsyncStorage.getItem('@userEmail');
      const storedId = await AsyncStorage.getItem('@userId'); // 👈 Carregar ID

      if (storedToken && storedName && storedEmail && storedId) {
        // 🛑 Adicionando o ID ao objeto User
        setUser({ email: storedEmail, name: storedName, id: parseInt(storedId, 10) });
      }
    } catch (error) {
      console.error("Erro ao carregar usuário do storage:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Implementação da função Login com chamada à API (Corrigida)
  async function login(email: string, password: string): Promise<void> {
    try {
      // 1. Chama a API
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      // 🛑 RASTREIO DE RESPOSTA (Mantido para referência, mas a correção está abaixo)
      console.log("-----------------------------------------");
      console.log("RESPOSTA BRUTA DO BACKEND (response.data):", response.data);
      console.log("TIPO DA RESPOSTA (typeof response.data):", typeof response.data);
      console.log("-----------------------------------------");

      // 2. CORREÇÃO: Usa response.data diretamente.
      const responseData = response.data;

      // 3. Processa dados - 🛑 Assumindo que o ID vem na resposta como 'id'
      const { token, user: userName, id } = responseData;

      if (typeof id !== 'number' && typeof id !== 'string') {
        console.warn("ID do vendedor não encontrado ou formato inesperado na resposta do login. Usando 0 como fallback.");
      }
      const userId = typeof id === 'string' ? parseInt(id, 10) : (id || 0);

      // 4. Salva no AsyncStorage
      await AsyncStorage.setItem('@userToken', token);
      await AsyncStorage.setItem('@userName', userName);
      await AsyncStorage.setItem('@userEmail', email);
      await AsyncStorage.setItem('@userId', userId.toString()); // 👈 Salvar ID

      // 5. Atualiza o estado
      setUser({ email, name: userName, id: userId }); // 👈 Incluir ID
    } catch (error) {
      // Lança o erro para o Login.tsx capturar e mostrar para o usuário
      throw error;
    }
  }
  // 6. Implementação do Logout
  async function logout() {
    await AsyncStorage.removeItem('@userToken');
    await AsyncStorage.removeItem('@userName');
    await AsyncStorage.removeItem('@userEmail');
    await AsyncStorage.removeItem('@userId'); // 👈 Remover ID
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ------------------------------------
// 3. HOOK
// ------------------------------------

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}