
import { Zap, Palette, HandCoins, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Zap className="w-8 h-8 text-yellow-500" />,
        title: "Agilidade Extrema",
        description: "Prazos recordes para sua empresa não parar. Pediu, chegou."
    },
    {
        icon: <Palette className="w-8 h-8 text-purple-500" />,
        title: "Personalização Total",
        description: "Cada detalhe do seu jeito. Adaptamos tudo à sua identidade visual."
    },
    {
        icon: <HandCoins className="w-8 h-8 text-green-500" />,
        title: "Melhor Preço Garantido",
        description: "Traga seu orçamento e nós cobrimos. Qualidade premium, preço justo."
    },
    {
        icon: <Sparkles className="w-8 h-8 text-blue-500" />,
        title: "Criação com IA",
        description: "Sem arte? Sem problemas. Criamos logos e imagens incríveis para você."
    }
];

export const Features = () => {
    return (
        <div id="services" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Por que escolher a 3 Horizontes?</h2>
                    <p className="text-xl text-gray-600">Tecnologia e criatividade a serviço do seu negócio.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-gray-100 hover:border-blue-100"
                        >
                            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 mx-auto">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{feature.title}</h3>
                            <p className="text-gray-600 text-center">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
