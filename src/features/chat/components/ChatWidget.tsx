import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChatWindow } from './ChatWindow';
import bloquinhoHead from '../../../assets/bloquinho.png';

export const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('open-chat', handleOpenChat);
        return () => window.removeEventListener('open-chat', handleOpenChat);
    }, []);

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 md:right-8 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all group"
            >
                {/* We can overlay the bloquinho image or just use an icon */}
                <div className="relative w-full h-full p-2">
                    <img src={bloquinhoHead} alt="Chat" className="w-full h-full object-contain" />
                    {!isOpen && (
                        <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    )}
                </div>
            </motion.button>

            <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};
