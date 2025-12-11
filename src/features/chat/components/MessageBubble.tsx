
import { Message } from '../services/chatService';
import { motion } from 'framer-motion';
import bloquinhoAvatar from '../../../assets/bloquinho.png';

interface MessageBubbleProps {
    message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
    const isUser = message.sender === 'user';

    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-blue-100 mr-2 flex-shrink-0 overflow-hidden border border-blue-200">
                    <img src={bloquinhoAvatar} alt="Bloquinho" className="w-full h-full object-cover" />
                </div>
            )}
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <span className={`text-[10px] block mt-1 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </motion.div>
        </div>
    );
};
