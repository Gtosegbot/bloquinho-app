
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';

export const ContactPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Fale Conosco</h1>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Canais de Atendimento</h2>
                        <ul className="space-y-3 text-gray-600">
                            <li>📞 (11) 99999-9999</li>
                            <li>📧 contato@grafica3horizontes.com.br</li>
                            <li>📍 São Paulo, SP</li>
                        </ul>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl">
                        <p className="mb-4">Use o chat do <strong>Bloquinho</strong> no canto da tela para um atendimento imediato!</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
