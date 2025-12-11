import { useState } from 'react';
import { Send, Upload, Mail, MessageSquare, Globe, BarChart, Video, Zap, X, Brain } from 'lucide-react';
import { n8nService } from '../../../services/n8nService';

type CampaignType = 'whatsapp' | 'email' | 'sms' | 'scraper' | 'social' | 'ads';

interface ScraperForm {
    url: string;
    description: string;
}

interface SocialForm {
    topic: string;
    tech: 'veo3' | 'sora' | 'nano_banana';
}

export const ClientImport = () => {
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [loading, setLoading] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<CampaignType | null>(null);

    // Forms State
    const [scraperForm, setScraperForm] = useState<ScraperForm>({ url: '', description: '' });
    const [socialForm, setSocialForm] = useState<SocialForm>({ topic: '', tech: 'nano_banana' });
    const [emailSubject, setEmailSubject] = useState('');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const preview = lines.slice(1, 6).map(line => {
                const [name, phone, email, company] = line.split(',');
                return { name, phone, email, company };
            });
            setPreviewData(preview);
        };
        reader.readAsText(file);
    };

    const openModal = (type: CampaignType) => {
        if (['whatsapp', 'email', 'sms'].includes(type) && previewData.length === 0) {
            alert('Importe uma lista de clientes primeiro para esta campanha!');
            return;
        }
        setActiveModal(type);
    };

    const submitAction = async () => {
        if (!activeModal) return;

        setLoading(activeModal);
        let payload: any = { clients: previewData };

        if (activeModal === 'scraper') {
            payload = { ...scraperForm };
        } else if (activeModal === 'social') {
            payload = { ...socialForm };
        } else if (activeModal === 'email') {
            payload = { ...payload, subject: emailSubject, campaignName: 'Email Mkt Manual' };
        }

        try {
            switch (activeModal) {
                case 'whatsapp':
                    await n8nService.triggerWhatsAppCampaign({ campaignName: 'Wpp Manual', clients: previewData });
                    break;
                case 'email':
                case 'sms':
                    await n8nService.triggerWorkflow('SMS', payload);
                    break;
                case 'scraper':
                    await n8nService.triggerWorkflow('SCRAPER', payload);
                    break;
                case 'social':
                    await n8nService.triggerWorkflow('SOCIAL_VIDEO', payload);
                    break;
                case 'ads':
                    await n8nService.triggerWorkflow('NANO_ADS', payload);
                    break;
            }
            alert(`✅ Ação ${type} iniciada com sucesso!`);
        } catch (error) {
            alert(`Erro ao iniciar ${type}. Veja o console.`);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-800">Marketing & Clientes</h1>
                <p className="text-gray-500">Gestão de base de contatos e disparadores de automação.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-600" />
                        Importar Base (CSV)
                    </h3>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                        <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                            <Upload className="w-10 h-10 text-gray-300 mb-2" />
                            <span className="text-blue-600 font-medium">Clique para selecionar</span>
                            <span className="text-gray-400 text-sm">ou arraste o arquivo aqui</span>
                        </label>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        Automações Rápidas
                    </h3>
                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
                        <CampaignButton
                            icon={<Send className="w-4 h-4" />}
                            label="Disparo WhatsApp"
                            desc="Enviar p/ lista importada"
                            onClick={() => handleCampaign('whatsapp')}
                            loading={loading === 'whatsapp'}
                        />
                        <CampaignButton
                            icon={<Mail className="w-4 h-4" />}
                            label="Campanha de Email"
                            desc="Newsletter / Promoção"
                            onClick={() => handleCampaign('email')}
                            loading={loading === 'email'}
                        />
                        <CampaignButton
                            icon={<MessageSquare className="w-4 h-4" />}
                            label="Disparo SMS"
                            desc="Avisos curtos"
                            onClick={() => handleCampaign('sms')}
                            loading={loading === 'sms'}
                        />
                        <div className="h-px bg-gray-100 my-2"></div>
                        <CampaignButton
                            icon={<Globe className="w-4 h-4" />}
                            label="Web Scraper"
                            desc="Extrair leads de URL"
                            onClick={() => handleCampaign('scraper')}
                            loading={loading === 'scraper'}
                        />
                        <CampaignButton
                            icon={<Video className="w-4 h-4" />}
                            label="Criar Vídeo Social"
                            desc="Shorts/Reels Automático"
                            onClick={() => handleCampaign('social')}
                            loading={loading === 'social'}
                        />
                        <CampaignButton
                            icon={<BarChart className="w-4 h-4" />}
                            label="Gestão de Tráfego"
                            desc="Relatório Nano Ads"
                            onClick={() => handleCampaign('ads')}
                            loading={loading === 'ads'}
                        />
                    </div>
                </div>
            </div>

            {previewData.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Base Carregada ({previewData.length})</h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Pronto para envio</span>
                    </div>
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
                </div>
            )}
        </div>
    );
};

// Helper Component for consistency
const CampaignButton = ({ icon, label, desc, onClick, loading }: any) => (
    <button
        onClick={onClick}
        disabled={loading}
        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center justify-between group disabled:opacity-50"
    >
        <div>
            <h4 className="font-semibold text-gray-700 text-sm">{label}</h4>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
        {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div> : <div className="text-gray-300 group-hover:text-purple-600">{icon}</div>}
    </button>
);
