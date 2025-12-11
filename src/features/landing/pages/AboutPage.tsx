
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, Clock } from 'lucide-react';
import bloquinhoHead from '../../../assets/bloquinho.png';

export const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Nossa História</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6">
                            Mais que uma gráfica, somos parceiros do seu negócio.
                        </h1>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            A Gráfica 3 Horizontes nasceu com o propósito de descomplicar o mundo dos impressos.
                            Unimos a tradição do papel com a agilidade da tecnologia digital para entregar não apenas produtos,
                            mas ferramentas de venda para sua empresa.
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Recentemente, demos um salto para o futuro com a integração de Inteligência Artificial em nosso atendimento.
                            O <strong>Bloquinho</strong>, nosso mascote digital, é o símbolo dessa nova era: rápido, preciso e sempre disponível.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <h4 className="text-3xl font-bold text-blue-600">15+</h4>
                                <span className="text-gray-500">Anos de Mercado</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-3xl font-bold text-purple-600">5k+</h4>
                                <span className="text-gray-500">Clientes Atendidos</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl -z-10"></div>
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
                            <div className="w-40 h-40 bg-blue-50 rounded-full p-4 mb-6">
                                <img src={bloquinhoHead} alt="Bloquinho" className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Conheça o Bloquinho</h3>
                            <p className="text-gray-500">
                                "Meu trabalho é garantir que seu orçamento saia na hora e sua dúvida seja resolvida num piscar de olhos!"
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-24 grid md:grid-cols-3 gap-8">
                    {[
                        { icon: <Award className="w-6 h-6 text-white" />, color: "bg-blue-500", title: "Qualidade Premium", text: "Materiais selecionados e acabamento impecável." },
                        { icon: <Clock className="w-6 h-6 text-white" />, color: "bg-purple-500", title: "Entrega Expressa", text: "Prazos que respeitam a urgência do seu negócio." },
                        { icon: <Users className="w-6 h-6 text-white" />, color: "bg-green-500", title: "Atendimento Humanizado", text: "Equipe pronta para resolver problemas complexos." }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-6 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-900/5`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};
