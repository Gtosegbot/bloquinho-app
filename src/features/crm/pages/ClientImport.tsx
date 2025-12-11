
import { useState } from 'react';
import { Upload, Send } from 'lucide-react';

import { n8nService } from '../../../services/n8nService';

export const ClientImport = () => {
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // ... (keep handleFileUpload)

    const handleWhatsAppCampaign = async () => {
        if (previewData.length === 0) {
            alert('Importe uma lista de clientes primeiro!');
            return;
        }

        if (!confirm(`Deseja disparar campanha para ${previewData.length} contatos?`)) return;

        setLoading(true);
        try {
            await n8nService.triggerWhatsAppCampaign({
                campaignName: 'Promoção Importação Manual',
                clients: previewData
            });
            alert('🚀 Campanha de WhatsApp iniciada com sucesso!');
        } catch (error) {
            alert('Erro ao iniciar campanha. Verifique o console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Headers ... */}

            <div className="grid md:grid-cols-2 gap-6">
                {/* File Upload Section ... */}

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5 text-purple-600" />
                        Campanhas
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={handleWhatsAppCampaign}
                            disabled={loading}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center justify-between group disabled:opacity-50"
                        >
                            <div>
                                <h4 className="font-semibold text-gray-700">Disparo WhatsApp (Promoção)</h4>
                                <p className="text-xs text-gray-500">Enviar para {previewData.length > 0 ? `${previewData.length} contatos` : 'lista importada'}</p>
                            </div>
                            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div> : <Send className="w-4 h-4 text-gray-300 group-hover:text-purple-600" />}
                        </button>
                        {/* Other buttons */}
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
