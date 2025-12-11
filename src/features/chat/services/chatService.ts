import { getGeminiResponse } from '../../services/gemini';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

// Connected to Gemini "Internal RAG"
export const sendMessageToN8N = async (text: string): Promise<string> => {
    return `O Bloquinho ouviu: "${text}". Em breve estarei conectado ao meu cérebro Gemini 2.5! 🧠`;
};
