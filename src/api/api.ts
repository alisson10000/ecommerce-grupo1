import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "http://192.168.100.5:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Requisição para Inserir o Token JWT
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@userToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Log detalhado do erro para debug
      console.log("=== ERRO NA API ===");
      console.log("Status:", error.response.status);
      console.log("Dados:", JSON.stringify(error.response.data, null, 2));

      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Erro ao processar requisição";

      if (error.response.status === 401) {
        // Lógica para deslogar se necessário
      }
      return Promise.reject(new Error(message));
    } else if (error.request) {
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