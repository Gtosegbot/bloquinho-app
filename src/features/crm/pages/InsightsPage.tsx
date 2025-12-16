import { useState, useEffect } from 'react';
import { Send, Sparkles, Bot, User, BrainCircuit } from 'lucide-react';
import { chatWithRAG } from '../../../services/gemini';
import { db } from '../../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const InsightsPage = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: 'Olá! Sou seu assistente de Inteligência de Negócios. Posso analisar seus leads, sugerir campanhas ou tirar dúvidas sobre seus documentos. Como posso ajudar hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [ragContext, setRagContext] = useState<any[]>([]);

    useEffect(() => {
        const loadContext = async () => {
            try {
                const snapshot = await getDocs(collection(db, "knowledge_base"));
                const docs = snapshot.docs.map(d => d.data());
                setRagContext(docs);
            } catch (e) {
                console.error("Error loading RAG context:", e);
            }
        };
        loadContext();
    }, []);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            // Local Gemini RAG Call (No Webhook/N8N)
            const responseText = await chatWithRAG(userMsg, ragContext);
            const assistantMsg = responseText || "Não consegui gerar uma resposta.";

            setMessages(prev => [...prev, { role: 'assistant', content: assistantMsg }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Desculpe, tive um erro ao processar sua solicitação.' }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        "Quem são meus leads mais quentes?",
        "Sugira uma campanha para clientes inativos",
        "Resuma o desempenho de vendas da semana",
        "O que diz o manual sobre devoluções?"
    ];

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-purple-50">
                <div className="p-2 bg-purple-600 rounded-lg text-white">
                    <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="font-bold text-gray-800">Insights & Inteligência</h1>
                    <p className="text-xs text-purple-600 font-medium">Conectado ao CRM e Base de Conhecimento</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap - 3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} `}>
                        <div className={`w - 8 h - 8 rounded - full flex items - center justify - center shrink - 0 ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-purple-100 text-purple-600'} `}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`max - w - [80 %] p - 3 rounded - 2xl text - sm ${msg.role === 'user' ? 'bg-gray-800 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'} `}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center animate-pulse">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
                {messages.length === 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => { setInput(s); }}
                                className="whitespace-nowrap px-3 py-1.5 bg-gray-50 hover:bg-purple-50 text-xs text-gray-600 hover:text-purple-700 border border-gray-200 hover:border-purple-200 rounded-full transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pergunte ao cérebro do Bloquinho..."
                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-purple-600/20"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
