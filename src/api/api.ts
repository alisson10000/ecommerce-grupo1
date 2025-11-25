import axios from "axios";
import { Platform } from "react-native";

const API_BASE_URL = "http://192.168.100.5:8080"; // Ex: "http://192.168.1.100:8080"

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {

      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        "Erro ao processar requisição";
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
