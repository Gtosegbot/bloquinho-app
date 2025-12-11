
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBsbBmw8esrB9wABFfXXP3Zs7ZkvKIJlqw";
const genAI = new GoogleGenerativeAI(API_KEY);

const modelsToTest = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-pro", "gemini-1.5-pro", "gemini-1.0-pro"];

async function testModels() {
    console.log("--- Iniciando Diagnóstico do Gemini ---");

    for (const modelName of modelsToTest) {
        console.log(`\nTestando modelo: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Teste de conexão. Responda 'OK'.");
            const response = await result.response;
            console.log(`✅ SUCESSO! O modelo '${modelName}' está respondendo.`);
            console.log("Resposta:", response.text());
        } catch (error) {
            console.log(`❌ FALHA no modelo '${modelName}':`);
            console.log(`   Erro:`, error.message);
        }
    }
    console.log("\n--- Fim do Diagnóstico ---");
}

testModels();
