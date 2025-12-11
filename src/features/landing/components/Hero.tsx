
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import bloquinhoImg from '../../../assets/bloquinho.png';

export const Hero = () => {
    return (
        <div className="relative pt-32 pb-20 lg:pt-48 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                            Sua Gráfica Inteligente <br />
                            <span className="text-blue-600">Com o Bloquinho!</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-lg">
                            Agilidade, personalização e os melhores preços do mercado.
                            Cobrimos qualquer orçamento e criamos sua arte com Inteligência Artificial.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
                                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all"
                            >
                                Falar com Bloquinho
                            </button>
                            <Link to="/services" className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-xl font-bold text-lg hover:border-blue-100 hover:bg-blue-50 transition-all flex items-center justify-center">
                                Ver Nossos Serviços
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center"
                    >
                        <div className="absolute inset-0 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                        <img
                            src={bloquinhoImg}
                            alt="Bloquinho - Mascote da Gráfica 3 Horizontes"
                            className="relative w-80 md:w-96 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        />
                    </motion.div>

                </div>
            </div>
        </div>
    );
};
