
import { useState } from 'react';
import { Send, Upload, Mail, MessageSquare, Globe, BarChart, Video, Zap, X, Brain } from 'lucide-react';
import { mcpService, MCP_ENDPOINTS } from '../../../services/mcpService';

type CampaignType = 'whatsapp' | 'email' | 'sms' | 'scraper' | 'social' | 'ads';

interface ScraperForm {
    url: string;
    description: string;
}

interface SocialForm {
    topic: string;
    tech: 'veo3' | 'sora' | 'nano_banana';
}

export const MarketingHub = () => {
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [loading, setLoading] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<CampaignType | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    // Forms State
    const [scraperForm, setScraperForm] = useState<ScraperForm>({ url: '', description: '' });
    const [socialForm, setSocialForm] = useState<SocialForm>({ topic: '', tech: 'nano_banana' });
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState(''); // New for manual email
    const [smsMessage, setSmsMessage] = useState(''); // New for manual SMS

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const preview = lines.slice(1, 6).map(line => {
                const [name, phone, email, company] = line.split(',');
                return {
                    name: name?.trim(),
                    phone: phone?.trim(),
                    email: email?.trim(),
                    company: company?.trim()
                };
            }).filter(u => u.name); // Filter empty rows

            setPreviewData(preview);
            addLog(`Arquivo carregado: ${preview.length} contatos encontrados.`);
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
        addLog(`Iniciando ação: ${activeModal.toUpperCase()}...`);

        try {
            switch (activeModal) {
                case 'whatsapp':
                    // Mapping to list of phones
                    const phones = previewData.map(c => c.phone);
                    await mcpService.sendWhatsApp("Olá! Campanha teste via MCP.", phones);
                    addLog('✅ WhatsApp: Disparo solicitado via MCP.');
                    break;

                case 'email':
                    // Hybrid Email Payload
                    const recipients = previewData.map(c => c.email).filter(e => e);
                    await mcpService.sendEmailCampaign({
                        subject: emailSubject,
                        body: emailBody || "<p>Olá, oferta especial!</p>",
                        recipients
                    });
                    addLog('✅ Email: Campanha enviada para processamento.');
                    break;

                case 'sms':
                    // Advanced SMS Payload
                    await mcpService.sendSMSCampaign(
                        "Campanha SMS Manual",
                        smsMessage || "Oferta imperdível!",
                        previewData
                    );
                    addLog('✅ SMS: Lote de mensagens enviado ao gateway.');
                    break;

                case 'scraper':
                    await mcpService.runScraper(scraperForm.url, scraperForm.description);
                    addLog('✅ Scraper: Agente IA iniciado na URL alvo.');
                    break;

                case 'social':
                    await mcpService.generateVideo(socialForm.topic, socialForm.tech);
                    addLog(`✅ Vídeo: Solicitação enviada para engine ${socialForm.tech}.`);
                    break;

                case 'ads':
                    // Assuming similar structure or generic call
                    await mcpService.call(MCP_ENDPOINTS.NANO_ADS, { prompt: "Gerar ads" });
                    addLog('✅ Nano Ads: Geração de criativos iniciada.');
                    break;
            }
            alert(`✅ Ação ${activeModal} enviada com sucesso!`);
            setActiveModal(null);
        } catch (error) {
            console.error(error);
            addLog(`❌ Erro ao executar ${activeModal}: Veja o console.`);
            alert(`Erro ao iniciar ${activeModal}.`);
        } finally {
            setLoading(null);
        }
    };

    const renderModalContent = () => {
        switch (activeModal) {
            case 'social':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tecnologia de Vídeo</label>
                            <select
                                value={socialForm.tech}
                                onChange={e => setSocialForm({ ...socialForm, tech: e.target.value as any })}
                                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
                            >
                                <option value="nano_banana">Nano Banana (Rápido)</option>
                                <option value="veo3">Google VEO3 (Alta Qualidade)</option>
                                <option value="sora">OpenAI Sora (Cinematográfico)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prompt / Roteiro</label>
                            <textarea
                                value={socialForm.topic}
                                onChange={e => setSocialForm({ ...socialForm, topic: e.target.value })}
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg outline-none focus:border-purple-500 resize-none"
                                placeholder="Descreva o vídeo..."
                            />
                        </div>
                    </div>
                );
            case 'scraper':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Alvo</label>
                            <input
                                type="url"
                                value={scraperForm.url}
                                onChange={e => setScraperForm({ ...scraperForm, url: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instruções de Extração</label>
                            <textarea
                                value={scraperForm.description}
                                onChange={e => setScraperForm({ ...scraperForm, description: e.target.value })}
                                className="w-full h-24 p-3 border border-gray-300 rounded-lg outline-none focus:border-purple-500 resize-none"
                                placeholder="Quais dados buscar? (Emails, Telefones...)"
                            />
                        </div>
                    </div>
                );
            case 'email':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                            <input
                                value={emailSubject}
                                onChange={e => setEmailSubject(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
                                placeholder="Oferta Especial..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Corpo (HTML simples)</label>
                            <textarea
                                value={emailBody}
                                onChange={e => setEmailBody(e.target.value)}
                                className="w-full h-24 p-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
                                placeholder="<p>Olá cliente...</p>"
                            />
                        </div>
                    </div>
                );
            case 'sms':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem (max 160 chars)</label>
                            <textarea
                                value={smsMessage}
                                onChange={e => setSmsMessage(e.target.value)}
                                className="w-full h-24 p-3 border border-gray-300 rounded-lg outline-none focus:border-purple-500 resize-none"
                                placeholder="Sua oferta aqui..."
                                maxLength={160}
                            />
                            <p className="text-xs text-right text-gray-400">{smsMessage.length}/160</p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="text-center py-6 text-gray-600">
                        <p>Confirmar execução da automação <strong>{activeModal?.toUpperCase()}</strong>?</p>
                        {activeModal === 'whatsapp' && <p className="text-sm mt-2 text-gray-400">Será enviado para {previewData.length} contatos.</p>}
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Brain className="w-8 h-8 text-purple-600" />
                        Marketing Hub & MCP
                    </h1>
                    <p className="text-gray-500">Gestão centralizada de automações via n8n.</p>
                </div>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column: Import */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-blue-600" />
                            1. Importar Base
                        </h3>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                            <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                                <Upload className="w-10 h-10 text-gray-300 mb-2" />
                                <span className="text-blue-600 font-medium">Selecionar CSV</span>
                                <span className="text-gray-400 text-xs mt-1">Nome, Telefone, Email, Empresa</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-[300px] overflow-y-auto">
                        <h3 className="text-sm font-bold text-gray-700 mb-2">Logs do Sistema de Execução</h3>
                        <div className="space-y-2">
                            {logs.length === 0 && <p className="text-xs text-gray-400 italic">Nenhuma atividade recente.</p>}
                            {logs.map((log, i) => (
                                <p key={i} className="text-xs text-mono text-gray-600 border-b border-gray-50 pb-1">{log}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle/Right: Actions & Preview */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <CampaignButton
                            icon={<Send className="w-4 h-4" />}
                            label="WhatsApp"
                            desc="Disparo em massa"
                            onClick={() => openModal('whatsapp')}
                            loading={loading === 'whatsapp'}
                        />
                        <CampaignButton
                            icon={<Mail className="w-4 h-4" />}
                            label="Email Mkt"
                            desc="Campanha HTML"
                            onClick={() => openModal('email')}
                            loading={loading === 'email'}
                        />
                        <CampaignButton
                            icon={<MessageSquare className="w-4 h-4" />}
                            label="SMS"
                            desc="Avisos Rápidos"
                            onClick={() => openModal('sms')}
                            loading={loading === 'sms'}
                        />
                        <CampaignButton
                            icon={<Globe className="w-4 h-4" />}
                            label="Scraper"
                            desc="Extrair Leads"
                            onClick={() => openModal('scraper')}
                            loading={loading === 'scraper'}
                        />
                        <CampaignButton
                            icon={<Video className="w-4 h-4" />}
                            label="Vídeo AI"
                            desc="Sora / VEO3"
                            onClick={() => openModal('social')}
                            loading={loading === 'social'}
                        />
                        <CampaignButton
                            icon={<BarChart className="w-4 h-4" />}
                            label="Nano Ads"
                            desc="Gestão Tráfego"
                            onClick={() => openModal('ads')}
                            loading={loading === 'ads'}
                        />
                    </div>

                    {previewData.length > 0 && (
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Preview ({previewData.length})</h3>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Pronto</span>
                            </div>
                            <div className="overflow-x-auto max-h-[300px]">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead className="sticky top-0 bg-white">
                                        <tr className="border-b border-gray-100 text-gray-500">
                                            <th className="py-2">Nome</th>
                                            <th className="py-2">Telefone</th>
                                            <th className="py-2">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, idx) => (
                                            <tr key={idx} className="border-b border-gray-50 text-gray-700 font-mono text-xs">
                                                <td className="py-2">{row.name}</td>
                                                <td className="py-2">{row.phone}</td>
                                                <td className="py-2">{row.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {activeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 capitalize flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                {activeModal === 'social' ? 'Criar Comercial' : activeModal.toUpperCase()}
                            </h2>
                            <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {renderModalContent()}

                        <div className="mt-8 pt-4 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setActiveModal(null)}
                                className="flex-1 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={submitAction}
                                disabled={!!loading}
                                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex justify-center items-center gap-2"
                            >
                                {loading ? 'Enviando ao MCP...' : 'Executar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Component
const CampaignButton = ({ icon, label, desc, onClick, loading }: any) => (
    <button
        onClick={onClick}
        disabled={loading}
        className="text-left p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all flex flex-col gap-2 group disabled:opacity-50"
    >
        <div className="flex justify-between w-full">
            <div className={`p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors`}>
                {loading ? <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full" /> : icon}
            </div>
        </div>
        <div>
            <h4 className="font-bold text-gray-800 text-sm">{label}</h4>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
    </button>
);
