
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
    } catch (error: any) {
        console.error("Gemini Error:", error);
        // Temporary debugging: Return raw error to user
        return `Erro Técnico Detalhado: ${error.message || JSON.stringify(error)}`;
    }
};

export const chatWithRAG = async (userMessage: string, contextDocs: any[]) => {
    if (!model) initializeGemini();

    const contextText = contextDocs.map(doc => `[DOCUMENTO: ${doc.name}]\n${doc.content || 'Conteúdo não extraível, apenas referência.'}`).join('\n\n');

    const ragPrompt = `
    ${SYSTEM_PROMPT}

    CONTEXTO EXTRAÍDO DA BASE DE CONHECIMENTO:
    ${contextText}

    Use o contexto acima para responder a pergunta do usuário. Se a resposta não estiver no contexto, use seu conhecimento geral mas avise que não encontrou nos documentos.
    `;

    try {
        const result = await model.generateContent([
            ragPrompt,
            `Pergunta: ${userMessage}`,
            "Resposta:"
        ]);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Gemini RAG Error:", error);
        return "Erro ao consultar o cérebro. 🧠";
    }
};

const SALES_SYSTEM_PROMPT = `
Você é o Bloquinho Vendedor.
OBJETIVO: Vender produtos gráficos do catálogo.
REGRAS DE NEGÓCIO:
1. Pagamento: Padrão é 50% de sinal (Pix) e 50% na entrega.
2. Se o cliente aceitar o preço: Gere o Pix do sinal (50%). Responda com a tag [PAYMENT:VALOR_DO_SINAL].
3. Se o cliente pedir desconto ou propar um prazo diferente: NÃO NEGOCIE. Diga que vai chamar um atendente humano e responda com a tag [HANDOVER].
4. Seja persuasivo e simpático.

CATÁLOGO:
${JSON.stringify(productCatalog, null, 2)}
`;

export const chatWithSalesBot = async (userMessage: string, history: string[] = []) => {
    if (!model) initializeGemini();

    try {
        const result = await model.generateContent([
            SALES_SYSTEM_PROMPT,
            ...history,
            `Cliente: ${userMessage}`,
            "Bloquinho:"
        ]);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Sales Bot Error:", error);
        return "Desculpe, estou com uma instabilidade. Poderia me chamar no WhatsApp?";
    }
};
