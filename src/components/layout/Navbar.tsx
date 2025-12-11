

import { Link } from 'react-router-dom';

export const Navbar = () => {
    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Gráfica 3 Horizontes
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Início</Link>
                        <Link to="/services" className="text-gray-600 hover:text-blue-600 transition-colors">Serviços</Link>
                        <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">Sobre</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contato</Link>
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                            Orçamento Rápido
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
