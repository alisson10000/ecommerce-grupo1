import axios from 'axios';
// Usando o IP da máquina na rede local, conforme combinado.
// Certifique-se de que este IP está correto e acessível pela sua máquina.
const BASE_URL = 'http://192.168.1.11:8000/assistente/chat'; 

/**
 * Envia uma mensagem de usuário para a API de IA, incluindo o ID do vendedor.
 * @param vendedorId O ID numérico do vendedor (obtido do AuthContext).
 * @param userMessage A mensagem de texto digitada pelo usuário.
 * @returns Uma Promise que resolve para a resposta de texto da IA.
 */
export async function sendMessageToIA(vendedorId: number, userMessage: string): Promise<string> {
    
    // Payload ajustado para o SWAGGER/FastAPI
    const payload = {
        vendedor_id: vendedorId,
        mensagem: userMessage, // A chave que o FastAPI espera é 'mensagem'
    };

    // 🛑 LOG DE RASTREIO 1: O que está sendo enviado e para onde
    console.log("-----------------------------------------");
    console.log("✈️ ENVIANDO REQUISIÇÃO PARA IA");
    console.log("URL de Destino:", BASE_URL);
    console.log("Payload Enviado:", JSON.stringify(payload));
    console.log("-----------------------------------------");

    try {
        // Simula um pequeno tempo de espera para melhorar a experiência do usuário
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        // Envia o payload correto
        const response = await axios.post(BASE_URL, payload);

        // 🛑 LOG DE RASTREIO 2: Resposta recebida
        console.log("✅ RESPOSTA DA IA RECEBIDA!");
        console.log("Status HTTP:", response.status);
        console.log("Dados da Resposta (response.data):", response.data);
        console.log("-----------------------------------------");

        // A resposta esperada do FastAPI é: { "reply": "..." }
        return response.data.resposta || "Resposta da IA inválida ou vazia.";
    } catch (error) {
        
        // 🛑 LOG DE RASTREIO 3: Erro
        console.error("❌ ERRO NA COMUNICAÇÃO COM A API DE IA:", error);
        console.log("-----------------------------------------");
        
        // Detecção de erro de rede
        if (axios.isAxiosError(error) && error.message.includes("Network Error")) {
            return "Erro de conexão: Verifique se o FastAPI está rodando em 192.168.0.103:8000 e se o Firewall está liberado.";
        }
        
        // Erros de status HTTP (e.g., 400 Bad Request, 500 Internal Server Error)
        if (axios.isAxiosError(error) && error.response) {
             console.error("Status da Resposta:", error.response.status, "Dados:", error.response.data);
             return `Erro do servidor (${error.response.status}): O formato da requisição pode estar incorreto. Detalhes no console.`;
        }
        
        return "Erro de conexão desconhecido. Sem contato com a IA. Tente novamente.";
    }
}