
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Fale com a Gente</h1>
                    <p className="text-xl text-gray-600">Estamos prontos para tirar suas dúvidas e começar seu projeto.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Contact Cards */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                            <Phone className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Telefone</h3>
                        <p className="text-gray-500 mb-4">Segunda a Sexta, 8h às 18h</p>
                        <a href="tel:+551199999999" className="text-blue-600 font-medium hover:underline">(11) 99999-9999</a>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-100 transition-colors">
                            <MessageCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">WhatsApp</h3>
                        <p className="text-gray-500 mb-4">Resposta rápida pelo Bloquinho</p>
                        <a href="#" className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-medium hover:bg-green-600 transition-colors">
                            Iniciar Conversa
                        </a>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group">
                        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-100 transition-colors">
                            <Mail className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Email</h3>
                        <p className="text-gray-500 mb-4">Para orçamentos complexos</p>
                        <a href="mailto:contato@grafica3horizontes.com.br" className="text-purple-600 font-medium hover:underline">contato@grafica3horizontes.com.br</a>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                    <div className="bg-gray-200 w-full h-80 rounded-2xl flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Mapa Interativo do Google Maps</p>
                            <span className="text-sm">(Placeholder)</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};
