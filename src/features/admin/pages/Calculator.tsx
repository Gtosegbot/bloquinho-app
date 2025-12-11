
import { useState } from 'react';
import { Calculator as CalcIcon, Copy, RefreshCw } from 'lucide-react';
import { productCatalog } from '../../admin/data/catalog';

export const Calculator = () => {
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(100);
    const [result, setResult] = useState<number | null>(null);

    const handleCalculate = () => {
        const product = productCatalog.find(p => p.codigo === selectedProduct);
        if (product && product.preco) {
            // Simple mock logic: base price * quantity (just for demo)
            // Real logic would depend on unit types (m2, un, etc)
            // Using a rough estimate for now
            // Simple mock logic
            const numericPrice = parseFloat(product.preco.replace('R$', '').replace(',', '.'));
            const finalPrice = numericPrice * quantity;

            setResult(finalPrice);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <header className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                    <CalcIcon className="w-8 h-8 text-blue-600" />
                    Calculadora Bloquinho
                </h1>
                <p className="text-gray-500">Simule orçamentos rápidos com base no catálogo.</p>
            </header>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
                        <select
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            <option value="">Selecione um produto...</option>
                            {productCatalog.map(p => (
                                <option key={p.codigo} value={p.codigo}>{p.produto} - R$ {p.preco}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade / Tamanho</label>
                        <input
                            type="number"
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <button
                        onClick={handleCalculate}
                        disabled={!selectedProduct}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Calcular Orçamento
                    </button>
                </div>

                {result !== null && (
                    <div className="mt-8 pt-8 border-t border-gray-100 animate-fade-in">
                        <div className="text-center">
                            <span className="text-gray-500 text-sm uppercase tracking-wide">Valor Estimado</span>
                            <div className="text-4xl font-extrabold text-gray-900 mt-2">
                                {result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
                                <Copy className="w-4 h-4" />
                                Copiar
                            </button>
                            <button onClick={() => setResult(null)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
                                <RefreshCw className="w-4 h-4" />
                                Limpar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
