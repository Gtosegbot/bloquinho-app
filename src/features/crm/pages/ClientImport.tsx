
import { useState } from 'react';
import { Upload, Users, Download, Send } from 'lucide-react';

export const ClientImport = () => {
    const [csvContent, setCsvContent] = useState('');
    const [previewData, setPreviewData] = useState<any[]>([]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setCsvContent(text);
            const lines = text.split('\n');
            // Mock parsing - just taking first 5 lines for preview
            const preview = lines.slice(1, 6).map(line => {
                const [name, phone, email, company] = line.split(',');
                return { name, phone, email, company };
            });
            setPreviewData(preview);
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Gestão de Clientes</h1>
                <p className="text-gray-500">Importe sua base de contatos em CSV para alimentar o Bloquinho.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-600" />
                        Importar CSV
                    </h3>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                        <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                            <Upload className="w-10 h-10 text-gray-300 mb-2" />
                            <span className="text-blue-600 font-medium">Clique para selecionar</span>
                            <span className="text-gray-400 text-sm">ou arraste o arquivo aqui</span>
                        </label>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <p className="font-medium mb-1">Formato esperado (CSV):</p>
                        <code className="bg-gray-100 px-2 py-1 rounded block">Nome, Telefone, Email, Empresa</code>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5 text-purple-600" />
                        Campanhas
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center justify-between group">
                            <div>
                                <h4 className="font-semibold text-gray-700">Disparo WhatsApp (Promoção)</h4>
                                <p className="text-xs text-gray-500">Enviar para lista importada</p>
                            </div>
                            <Send className="w-4 h-4 text-gray-300 group-hover:text-purple-600" />
                        </button>
                        <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center justify-center group">
                            <div className="text-center text-gray-500 text-sm">
                                + Nova Campanha
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {previewData.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Pré-visualização da Importação</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-sm text-gray-500">
                                    <th className="py-2">Nome</th>
                                    <th className="py-2">Telefone</th>
                                    <th className="py-2">Email</th>
                                    <th className="py-2">Empresa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 text-gray-700">
                                        <td className="py-2">{row.name}</td>
                                        <td className="py-2">{row.phone}</td>
                                        <td className="py-2">{row.email}</td>
                                        <td className="py-2">{row.company}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                            Confirmar Importação
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
