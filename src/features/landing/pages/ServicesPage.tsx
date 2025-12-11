
import { Navbar } from '../../../components/layout/Navbar';
import { Footer } from '../../../components/layout/Footer';
import { Printer, Package, Palette, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const services = [
    {
        icon: <Printer className="w-10 h-10 text-blue-600" />,
        title: "Impressão Digital & Offset",
        description: "Qualidade fotográfica para pequenas tiragens e custo-benefício imbatível para grandes volumes.",
        items: ["Cartões de Visita", "Flyers e Panfletos", "Catálogos e Revistas", "Adesivos em Vinil"]
    },
    {
        icon: <Package className="w-10 h-10 text-purple-600" />,
        title: "Embalagens Personalizadas",
        description: "Valorize seu produto com embalagens que vendem por si só. Design e funcionalidade.",
        items: ["Caixas de Papel Cartão", "Sacolas Personalizadas", "Rótulos Adesivos", "Tags para Roupas"]
    },
    {
        icon: <FileText className="w-10 h-10 text-green-600" />,
        title: "Papelaria Corporativa",
        description: "Padronize a comunicação da sua empresa com materiais de escritório de alta qualidade.",
        items: ["Blocos de Pedido", "Receituários", "Pastas com Orelha", "Envelopes"]
    },
    {
        icon: <Palette className="w-10 h-10 text-pink-600" />,
        title: "Comunicação Visual",
        description: "Destaque sua marca no ponto de venda com materiais de grande formato.",
        items: ["Banners em Lona", "Adesivos de Vitrine", "Placas de Sinalização", "Wind Banners"]
    }
];

export const ServicesPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-blue-900 text-white pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Soluções que Impressionam
                    </motion.h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Do cartão de visita ao banner gigante, entregamos qualidade em cada detalhe.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 py-20 -mt-20">
                <div className="grid md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-gray-100"
                        >
                            <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {service.description}
                            </p>
                            <ul className="space-y-2">
                                {service.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center text-gray-500">
                                        <ArrowRight className="w-4 h-4 mr-2 text-blue-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-white py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Não achou o que procura?</h2>
                    <p className="text-gray-600 mb-8">
                        Nossa equipe especializada (e o Bloquinho!) podem criar soluções sob medida para você.
                    </p>
                    <button className="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
                        Falar com Especialista no WhatsApp
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};
