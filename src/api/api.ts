import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Novo: Para pegar o token

const API_BASE_URL = "http://192.168.0.103:8080"; // Mantenha o seu IP

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🚀 NOVO: Interceptor de Requisição para Inserir o Token JWT
api.interceptors.request.use(
  async (config) => {
    // Tenta obter o token salvo após o login
    const token = await AsyncStorage.getItem('@userToken');

    if (token) {
      // Se o token existir, adiciona-o ao cabeçalho Authorization
      // Formato: Bearer [TOKEN]
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Interceptor de Resposta (Mantido e Melhorado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Lógica de tratamento de erro que você já tinha (para 4xx, 5xx)
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Erro ao processar requisição";

      // ⚠️ Novo: Trata especificamente o erro 401 (Não Autorizado)
      if (error.response.status === 401) {
          // Aqui você pode adicionar a lógica para deslogar o usuário automaticamente
      }
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Lógica de erro de rede (servidor desligado, IP incorreto, etc.)
      const platformHint = Platform.OS === 'android' 
        ? "http://10.0.2.2:8080 (Android Emulator) ou IP da sua máquina (dispositivo físico)"
        : "http://localhost:8080";
      return Promise.reject(
        new Error(`Erro de conexão. Verifique se a API está rodando em ${platformHint}`)
      );
    } else {
      return Promise.reject(error);
    }
  }
);