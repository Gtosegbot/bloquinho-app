
import { useState, useRef, useEffect } from 'react';
import { Send, X, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../services/chatService';
import { chatWithSalesBot } from '../../../services/gemini';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChatWindow = ({ isOpen, onClose }: ChatWindowProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Olá! Sou o Bloquinho. Como posso ajudar com seus impressos hoje?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            // Internal Sales Bot (Gemini)
            const responseText = await chatWithSalesBot(userMsg.text);

            let displayContent = responseText;
            let type: 'text' | 'payment_request' | 'handover' = 'text';

            if (responseText.includes('[HANDOVER]')) {
                displayContent = responseText.replace('[HANDOVER]', '');
                type = 'handover';
            } else if (responseText.includes('[PAYMENT:')) {
                displayContent = responseText.replace(/\[PAYMENT:(.*?)\]/, '$1'); // Keep the value in text for now, UI logic below
                type = 'payment_request';
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: displayContent,
                sender: 'bot',
                timestamp: new Date(),
                // We'll need to extend Message type later for custom UI, or just append distinct bubbles
            };

            setMessages((prev) => [...prev, botMsg]);

            // Inject special UI bubbles
            if (type === 'payment_request') {
                const value = responseText.match(/\[PAYMENT:(.*?)\]/)?.[1] || '0,00';
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + '_pay',
                    text: `Gerando QR Code Pix de R$ ${value}... 🪙`,
                    sender: 'bot'
                }]);
            } else if (type === 'handover') {
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + '_human',
                    text: "Conectando com atendente humano... 👨‍💻",
                    sender: 'bot'
                }]);
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-24 right-4 md:right-8 w-full md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="font-bold">Chat Bloquinho</h3>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} message={msg} />
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-gray-400 text-xs ml-2 mb-4">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                Bloquinho está digitando...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputText.trim()}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
