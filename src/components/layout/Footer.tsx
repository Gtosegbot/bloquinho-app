
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block mb-4">
                            Gráfica 3 Horizontes
                        </span>
                        <p className="text-gray-400 max-w-sm">
                            Sua parceira em impressão e design. Trazendo inovação e qualidade para cada projeto.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-4">Contato</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>(11) 99999-9999</li>
                            <li>contato@grafica3horizontes.com.br</li>
                            <li>São Paulo, SP</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-4">Redes Sociais</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-green-600 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Gráfica 3 Horizontes. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
};
