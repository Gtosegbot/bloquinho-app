
import { useState, useEffect } from 'react';
import { Upload, Search, Trash2, FileText, CheckCircle } from 'lucide-react';
import { productCatalog } from '../data/catalog';
import { db, storage } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';

interface Document {
    name: string;
    type: string;
    date: string;
    url?: string;
    status: 'indexed' | 'processing';
}

export const KnowledgeBase = () => {
    const [activeTab, setActiveTab] = useState<'products' | 'docs'>('products');
    const [searchTerm, setSearchTerm] = useState('');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchDocs = async () => {
            const querySnapshot = await getDocs(collection(db, "knowledge_base"));
            const docs = querySnapshot.docs.map(doc => doc.data() as Document);
            setDocuments(docs);
        };
        fetchDocs();
    }, []);

    const filteredProducts = productCatalog.filter(p =>
        p.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // 1. Upload to Firebase Storage
            const storageRef = ref(storage, `knowledge-base/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            // 2. Save Metadata to Firestore
            const newDoc: Document = {
                name: file.name,
                type: file.type || 'PDF',
                date: new Date().toLocaleDateString(),
                url: downloadURL,
                status: 'indexed'
            };

            await addDoc(collection(db, "knowledge_base"), newDoc);

            // Update Local State directly
            setDocuments(prev => [...prev, newDoc]);
            alert('Documento salvo no Banco de Dados Interno (Firebase)! 🧠');
        } catch (error) {
            console.error("Upload Error:", error);
            alert('Erro ao salvar no banco interno.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Cérebro do Bloquinho 🧠</h1>
                    <p className="text-gray-500">Gerencie o conhecimento utilizado para inteligência e orçamentos.</p>
                </div>
                {activeTab === 'docs' && (
                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Enviando...' : 'Upload PDF'}
                        <input type="file" className="hidden" accept=".pdf,.txt,.csv" onChange={handleFileUpload} disabled={uploading} />
                    </label>
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

            {/* Docs List */}
            {activeTab === 'docs' && (
                <div className="space-y-4">
                    {documents.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="bg-white p-6 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group h-64">
                                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-1">Upload de Novo Documento</h3>
                                <p className="text-sm text-gray-400">PDFs, Manuais ou Tabelas</p>
                                <input type="file" className="hidden" accept=".pdf,.txt,.csv" onChange={handleFileUpload} disabled={uploading} />
                            </label>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4">Nome</th>
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Status IA</th>
                                        <th className="px-6 py-4">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {documents.map((doc, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-gray-800">{doc.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{doc.date}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Indexado
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
