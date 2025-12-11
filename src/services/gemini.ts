
import { GoogleGenerativeAI } from "@google/generative-ai";
import { productCatalog } from "../features/admin/data/catalog";

// Configure your API Key here or in .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

export const initializeGemini = () => {
    if (API_KEY && !genAI) {
        genAI = new GoogleGenerativeAI(API_KEY);
        // User explicitly confirmed "gemini-2.5-flash" is the correct model for this timeframe (Dec 2025).
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }
};

const SYSTEM_PROMPT = `
Você é o Bloquinho, o mascote virtual da Gráfica 3 Horizontes.
Sua personalidade é: Amigável, ágil, prestativo e especialista em impressos e artes gráficas.
Você está conectado a uma base de dados de produtos. Use-a para responder orçamentos AGORA.

CATÁLOGO DE PRODUTOS:
${JSON.stringify(productCatalog, null, 2)}

REGRAS DE ATENDIMENTO:
1. Responda de forma curta e direta, como no WhatsApp.
2. Se o cliente perguntar preço, consulte a tabela acima. Se não achar, peça mais detalhes.
3. Se perguntarem sobre criação de arte, diga que também criamos com IA ou designers humanos.
4. Para fechar o pedido, oriente o cliente a clicar no botão de WhatsApp para falar com um humano e finalizar o pagamento.
5. Use emojis moderadamente (🤖, 📄, ✅, 🚀).
`;

export const getGeminiResponse = async (userMessage: string) => {
    if (!API_KEY) {
        return "⚠️ Erro: Chave da API Gemini não configurada. Verifique o .env.local";
    }

    if (!model) {
        initializeGemini();
    }

    try {
        const result = await model.generateContent([
            SYSTEM_PROMPT,
            `Cliente diz: ${userMessage}`,
            "Bloquinho responde:"
        ]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Ops! Tive um pequeno problema técnico. Pode repetir? 🤕";
    }
};
