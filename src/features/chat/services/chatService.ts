
import { getGeminiResponse } from '../../../services/gemini';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

// Connected to Gemini "Internal RAG"
export const sendMessageToN8N = async (text: string): Promise<string> => {
    // Call Gemini Service
    const response = await getGeminiResponse(text);
    return response;
};
