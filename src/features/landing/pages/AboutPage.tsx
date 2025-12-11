
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';

export const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Sobre a Gráfica 3 Horizontes</h1>
                <p className="text-lg text-gray-600 mb-4">
                    Com anos de tradição e inovação, a Gráfica 3 Horizontes é referência em qualidade e agilidade.
                </p>
                <p className="text-gray-600">
                    Nossa missão é transformar suas ideias em impressos incríveis, utilizando a melhor tecnologia do mercado e um atendimento humanizado (agora com a ajuda do Bloquinho!).
                </p>
            </div>
            <Footer />
        </div>
    );
};
