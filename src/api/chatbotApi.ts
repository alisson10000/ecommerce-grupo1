import axios from 'axios';

const BASE_URL = 'http://localhost:8000/assistente/chat'; 

export async function sendMessageToIA(userMessage) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    const response = await axios.post(BASE_URL, {
      message: userMessage,
    });

    return response.data.reply || "Sem acesso com a IA";
  } catch (error) {
    console.error("Erro na comunicação com a API de IA:", error);
    return "Erro de conexão: Sem contato com a IA. Tente novamente.";
  }
}