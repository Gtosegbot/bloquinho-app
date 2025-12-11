
export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

// Mock service for now, will connect to n8n later
export const sendMessageToN8N = async (text: string): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return a mock response based on input
    return `O Bloquinho ouviu: "${text}". Em breve estarei conectado ao meu cérebro Gemini 2.5! 🧠`;
};
