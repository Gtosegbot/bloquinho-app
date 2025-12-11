
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';

export const ServicesPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Nossos Serviços</h1>
                <p className="text-lg text-gray-600">
                    Oferecemos uma gama completa de soluções gráficas:
                </p>
                <ul className="list-disc list-inside mt-4 text-gray-600 space-y-2">
                    <li>Impressão Digital e Offset</li>
                    <li>Sinalização e Grandes Formatos</li>
                    <li>Brindes Personalizados</li>
                    <li>Design Gráfico e Criação de Arte</li>
                </ul>
            </div>
            <Footer />
        </div>
    );
};
