
import { useState } from 'react';
import { Upload, Search, Trash2 } from 'lucide-react';
import { productCatalog } from '../data/catalog';

export const KnowledgeBase = () => {
    const [activeTab, setActiveTab] = useState<'products' | 'docs'>('products');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = productCatalog.filter(p =>
        p.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Cérebro do Bloquinho 🧠</h1>
                    <p className="text-gray-500">Gerencie o conhecimento utilizado para inteligência e orçamentos.</p>
                </div>
                {activeTab === 'docs' && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload PDF
                    </button>
                )}
            </header>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'products' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Catálogo de Produtos
                    {activeTab === 'products' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('docs')}
                    className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'docs' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Documentos (PDFs)
                    {activeTab === 'docs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                </button>
            </div>

            {/* Content Actions */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder={activeTab === 'products' ? "Buscar por nome ou código..." : "Buscar documentos..."}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Products Table */}
            {activeTab === 'products' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Código</th>
                                <th className="px-6 py-4">Produto</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Preço</th>
                                <th className="px-6 py-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{product.codigo}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">{product.produto}</p>
                                        <p className="text-xs text-gray-400">{product.especificacoes}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-medium">{product.categoria}</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-800">R$ {product.preco}</td>
                                    <td className="px-6 py-4">
                                        <button className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            Nenhum produto encontrado.
                        </div>
                    )}
                </div>
            )}

            {/* Docs Placeholder */}
            {activeTab === 'docs' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group h-64">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Upload de Novo Documento</h3>
                        <p className="text-sm text-gray-400">PDFs, Manuais ou Tabelas</p>
                    </div>
                </div>
            )}
        </div>
    );
};
