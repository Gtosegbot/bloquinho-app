
import { useState, useEffect } from 'react';
import { Send, Upload, Mail, MessageSquare, Globe, BarChart, Video, Zap, X, Brain, Users, Tag, CheckSquare, Square } from 'lucide-react';
import { mcpService, MCP_ENDPOINTS } from '../../../services/mcpService';
import { crmService } from '../../../services/crmService';
import { EmailSelector } from '../components/EmailSelector';
import { Customer } from '../../crm/types/crm.types';

type CampaignType = 'whatsapp' | 'email' | 'sms' | 'scraper' | 'social' | 'ads';
type ViewMode = 'import' | 'database';

interface ScraperForm {
    url: string;
    description: string;
}

interface SocialForm {
    topic: string;
    tech: 'veo3' | 'sora' | 'nano_banana';
}

export const MarketingHub = () => {
    // Data State
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [dbClients, setDbClients] = useState<Customer[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('database'); // Default to database view if empty import

    // UI State
    const [loading, setLoading] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<CampaignType | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [showTagModal, setShowTagModal] = useState(false);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        const clients = await crmService.getCustomers();
        setDbClients(clients);
        // If we have clients, default to database view
        if (clients.length > 0 && previewData.length === 0) {
            setViewMode('database');
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === dbClients.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(dbClients.map(c => c.id));
        }
    };

    const toggleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleAddTag = async () => {
        if (!newTag || selectedIds.length === 0) return;
        setLoading('tagging');
        let count = 0;
        for (const id of selectedIds) {
            const client = dbClients.find(c => c.id === id);
            if (client) {
                const updatedTags = [...(client.tags || []), newTag];
                // Remove duplicates
                const uniqueTags = [...new Set(updatedTags)];
                await crmService.updateCustomerTags(id, uniqueTags);
                count++;
            }
        }
        addLog(`✅ Tag "${newTag}" adicionada a ${count} clientes.`);
        setNewTag('');
        setShowTagModal(false);
        setLoading(null);
        loadClients(); // Refresh
    };

    // Forms State
    const [scraperForm, setScraperForm] = useState<ScraperForm>({ url: '', description: '' });
    const [socialForm, setSocialForm] = useState<SocialForm>({ topic: '', tech: 'nano_banana' });
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [smsMessage, setSmsMessage] = useState('');
    const [whatsappMessage, setWhatsappMessage] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null); // Added this

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };



    const downloadTemplate = () => {
        const headers = ["Nome,Email,Telefone,Endereço,Cidade,Estado,País,CEP,Data de Nascimento,Observações"];
        const sample = "João Silva,joao@exemplo.com,5511999998888,Rua Exemplo 123,São Paulo,SP,Brasil,01000-000,1990-01-01,Cliente VIP";
        const csvContent = "data:text/csv;charset=utf-8," + [headers, sample].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "modelo_importacao.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const processImport = async () => {
        if (previewData.length === 0) return;
        setLoading('importing');
        addLog(`Iniciando importação de ${previewData.length} contatos para o CRM...`);

        let successCount = 0;
        try {
            // Import mcpService and crmService are already available? 
            // We need to import crmService if not present.  Checking file... 
            // File imports mcpService. We need `import { crmService } from '../../../services/crmService';` at top.
            // Assumption: I will fix imports in next step if missing.

            // Note: Parallel execution might be faster but let's do sequential for reliability first or Promise.all chunks.
            // Dynamic import removed (now static)

            for (const contact of previewData) {
                // 1. Sync Customer
                const customerId = await crmService.syncCustomer({
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    address: contact.address,
                    city: contact.city,
                    state: contact.state,
                    country: contact.country,
                    zip: contact.zip,
                    dob: contact.dob,
                    notes: contact.notes
                });

                if (customerId) {
                    // 2. Create Deal (Lead)
                    await crmService.createDeal({
                        title: `Lead: ${contact.name}`,
                        value: 0, // Default value, maybe 0 or estimated
                        customerId: customerId,
                        customerName: contact.name,
                        customerEmail: contact.email,
                        customerPhone: contact.phone,
                        status: 'lead', // "Novos Leads" column
                        priority: 'medium',
                        paymentStatus: 'pending',
                        paymentTerms: 'full',
                        amountPaid: 0,
                        description: `Importado via CSV. Notas: ${contact.notes || ''}`
                    });
                    successCount++;
                }
            }
            addLog(`✅ Sucesso! ${successCount} leads criados no Kanban.`);
            alert(`Importação concluída! ${successCount} novos leads.`);
            setPreviewData([]); // Clear preview
            loadClients(); // Refresh DB list
            setViewMode('database'); // Switch to database view
        } catch (error) {
            console.error("Import error:", error);
            addLog("❌ Erro durante a importação. Verifique o console.");
        } finally {
            setLoading(null);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const preview = lines.slice(1).map(line => {
                // Basic CSV parser handling standard comma separation
                const cols = line.split(',');
                if (cols.length < 2) return null; // Skip empty/invalid lines

                const email = cols[1]?.trim();
                const phone = cols[2]?.trim();
                let name = cols[0]?.trim();

                // Validation: Must have at least Name OR Email OR Phone
                if (!name && !email && !phone) return null;

                // Fallback Name
                if (!name) {
                    name = email ? `Cliente (${email})` : `Cliente (${phone})`;
                }

                return {
                    name,
                    email,
                    phone,
                    address: cols[3]?.trim(),
                    city: cols[4]?.trim(),
                    state: cols[5]?.trim(),
                    country: cols[6]?.trim(),
                    zip: cols[7]?.trim(),
                    dob: cols[8]?.trim(),
                    notes: cols[9]?.trim(),
                    tags: [] // Initialize empty tags
                };
            }).filter(u => u !== null);

            setPreviewData(preview);
            addLog(`Arquivo carregado: ${preview.length} contatos encontrados.`);
        };
        reader.readAsText(file);
    };

    const openModal = (type: CampaignType) => {
        if (['whatsapp', 'email', 'sms'].includes(type)) {
            if (viewMode === 'import' && previewData.length === 0) {
                alert('Importe uma lista primeiro!');
                return;
            }
            if (viewMode === 'database' && selectedIds.length === 0) {
                alert('Selecione pelo menos um cliente da lista!');
                return;
            }
        }
        setActiveModal(type);
    };

    // Validation Helpers
    const isValidEmail = (email: string) => {
        if (!email) return false;
        const lower = email.toLowerCase();
        // Reject if contains "email" as a placeholder word or is clearly invalid
        if (lower.includes('email') || !lower.includes('@')) return false;
        return true;
    };

    const isValidPhone = (phone: string) => {
        if (!phone) return false;
        const lower = phone.toLowerCase();
        // Reject if contains "phone" or "telefone" or has no digits
        if (lower.includes('phone') || lower.includes('tel') || !/\d/.test(phone)) return false;
        return true;
    };

    const submitAction = async () => {
        if (!activeModal) return;

        setLoading(activeModal);
        addLog(`Iniciando ação: ${activeModal.toUpperCase()}...`);

        try {
            switch (activeModal) {
                case 'whatsapp': {
                    let recipients: any[] = [];
                    if (viewMode === 'database') {
                        recipients = dbClients.filter(c => selectedIds.includes(c.id));
                    } else {
                        recipients = previewData;
                    }

                    // Filter valid phones and map to strict object structure
                    const validTargets = recipients
                        .filter(c => c.phone && isValidPhone(c.phone))
                        .map(c => ({
                            name: c.name || 'Cliente',
                            phone: c.phone
                        }));

                    if (validTargets.length === 0) {
                        alert('Nenhum telefone válido encontrado nos contatos selecionados.');
                        setLoading(null);
                        return;
                    }

                    await mcpService.sendWhatsApp("Olá! Campanha teste via MCP.", validTargets);
                    addLog(`✅ WhatsApp: Disparo solicitado para ${validTargets.length} contatos válidos.`);
                    break;
                }

                case 'email': {
                    let recipients: any[] = [];
                    if (viewMode === 'database') {
                        recipients = dbClients.filter(c => selectedIds.includes(c.id));
                    } else {
                        recipients = previewData;
                    }

                    // Filter valid emails and map to { name, email }
                    const validTargets = recipients
                        .filter(c => c.email && isValidEmail(c.email))
                        .map(c => ({
                            name: c.name || 'Cliente',
                            email: c.email
                        }));

                    if (validTargets.length === 0) {
                        alert('Nenhum email válido encontrado nos contatos selecionados.');
                        setLoading(null);
                        return;
                    }

                    await mcpService.sendEmailCampaign({
                        subject: emailSubject,
                        body: emailBody || "<p>Olá, oferta especial!</p>",
                        recipients: validTargets // Now passing objects
                    });
                    addLog(`✅ Email: Enviado para ${validTargets.length} endereços válidos.`);
                    break;
                }

                case 'sms': {
                    let recipients: any[] = [];
                    if (viewMode === 'database') {
                        recipients = dbClients.filter(c => selectedIds.includes(c.id));
                    } else {
                        recipients = previewData;
                    }

                    const validRecipients = recipients.filter(c => c.phone && isValidPhone(c.phone));

                    if (validRecipients.length === 0) {
                        alert('Nenhum telefone válido para SMS.');
                        setLoading(null);
                        return;
                    }

                    await mcpService.sendSMSCampaign(
                        "Campanha SMS Manual",
                        smsMessage || "Oferta imperdível!",
                        validRecipients
                    );
                    addLog(`✅ SMS: Enviado para ${validRecipients.length} contatos válidos.`);
                    break;
                }

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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Escolha um Modelo</label>
                            <EmailSelector
                                selectedId={selectedTemplate?.id}
                                onSelect={(template) => {
                                    setSelectedTemplate(template);
                                    if (template.type === 'text') {
                                        setEmailBody(template.preview);
                                    } else {
                                        setEmailBody(template.html);
                                    }
                                }}
                            />
                        </div>

                        {selectedTemplate && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Personalizar Conteúdo ({selectedTemplate.type === 'html' ? 'HTML' : 'Texto'})</label>
                                <textarea
                                    value={emailBody}
                                    onChange={e => setEmailBody(e.target.value)}
                                    className="w-full h-32 p-3 border border-gray-300 rounded-lg outline-none focus:border-purple-500 font-mono text-xs"
                                    placeholder="Conteúdo do email..."
                                />
                            </div>
                        )}
                    </div>
                );

            case 'whatsapp':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem WhatsApp</label>
                            <textarea
                                value={whatsappMessage}
                                onChange={e => setWhatsappMessage(e.target.value)}
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg outline-none focus:border-purple-500 resize-none"
                                placeholder="Digite sua mensagem para o WhatsApp... (Olá [Nome] será adicionado automaticamente)"
                            />
                            <p className="text-xs text-gray-500">
                                Dica: A saudação inicial com o nome do cliente é adicionada automaticamente.
                            </p>
                        </div>
                    </div>
                );

            case 'sms':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem SMS</label>
                            <textarea
                                value={smsMessage}
                                onChange={e => setSmsMessage(e.target.value)}
                                className="w-full h-24 p-3 border border-gray-300 rounded-lg outline-none focus:border-purple-500 resize-none"
                                placeholder="Digite sua mensagem curta..."
                                maxLength={160}
                            />
                            <div className="text-right text-xs text-gray-500">
                                {smsMessage.length}/160 caracteres
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="text-center py-6 text-gray-600">
                        <p>Confirmar execução da automação <strong>{activeModal?.toUpperCase()}</strong>?</p>
                        {/* Removed redundant whatsapp check */}
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
                        {/* Status Message for large imports */}
                        {loading === 'importing' && (
                            <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center gap-2 animate-pulse">
                                <Upload className="w-4 h-4" /> Processando contatos...
                            </div>
                        )}

                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                            <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                                <Upload className="w-10 h-10 text-gray-300 mb-2" />
                                <span className="text-blue-600 font-medium">Selecionar CSV</span>
                                <span className="text-gray-400 text-xs mt-1">Nome, Email, Telefone, etc...</span>
                            </label>
                        </div>

                        {previewData.length > 0 && (
                            <div className="mt-4">
                                <div className="text-xs text-center text-gray-500 mb-2">
                                    {previewData.length} contatos prontos para importar.
                                </div>
                                <button
                                    onClick={processImport}
                                    disabled={loading === 'importing'}
                                    className="w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading === 'importing' ? 'Salvando...' : 'Confirmar Importação'}
                                </button>
                            </div>
                        )}

                        <button
                            onClick={downloadTemplate}
                            className="w-full mt-2 py-2 text-sm text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Upload className="w-4 h-4 rotate-180" /> Baixar Modelo CSV
                        </button>
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

                    {/* View Switcher & Toolbar */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('database')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${viewMode === 'database' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <Users className="w-4 h-4" /> Base de Clientes ({dbClients.length})
                                </button>
                                <button
                                    onClick={() => setViewMode('import')}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${viewMode === 'import' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <Upload className="w-4 h-4" /> Importação ({previewData.length})
                                </button>
                            </div>

                            {viewMode === 'database' && (
                                <div className="flex gap-2">
                                    {selectedIds.length > 0 && (
                                        <button
                                            onClick={() => setShowTagModal(true)}
                                            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-1 transition-colors"
                                        >
                                            <Tag className="w-3 h-3" />
                                            Adicionar Tag ({selectedIds.length})
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* List Content */}
                        <div className="overflow-x-auto max-h-[500px]">
                            {viewMode === 'import' && previewData.length === 0 && (
                                <div className="text-center py-10 text-gray-400">
                                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>Nenhum arquivo CSV carregado para pré-visualização.</p>
                                </div>
                            )}

                            {(viewMode === 'database' || (viewMode === 'import' && previewData.length > 0)) && (
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                        <tr className="border-b border-gray-100 text-gray-500 bg-gray-50/50">
                                            {viewMode === 'database' && (
                                                <th className="py-2 px-3 w-10">
                                                    <button onClick={toggleSelectAll}>
                                                        {selectedIds.length === dbClients.length && dbClients.length > 0 ?
                                                            <CheckSquare className="w-4 h-4 text-purple-600" /> :
                                                            <Square className="w-4 h-4 text-gray-300" />
                                                        }
                                                    </button>
                                                </th>
                                            )}
                                            <th className="py-2 px-3">Nome</th>
                                            <th className="py-2 px-3">Email/Contato</th>
                                            {viewMode === 'database' && <th className="py-2 px-3">Tags</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(viewMode === 'database' ? dbClients : previewData).map((row, idx) => {
                                            // Handle potential missing IDs in preview by using index fallback
                                            const rowId = (row as Customer).id || `preview-${idx}`;
                                            const isSelected = selectedIds.includes(rowId);

                                            return (
                                                <tr key={rowId} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-purple-50 hover:bg-purple-50' : ''}`}>
                                                    {viewMode === 'database' && (
                                                        <td className="py-2 px-3">
                                                            <button onClick={() => toggleSelectOne(rowId)}>
                                                                {isSelected ?
                                                                    <CheckSquare className="w-4 h-4 text-purple-600" /> :
                                                                    <Square className="w-4 h-4 text-gray-300" />
                                                                }
                                                            </button>
                                                        </td>
                                                    )}
                                                    <td className="py-2 px-3">
                                                        <div className="font-medium text-gray-800">{row.name || 'Sem Nome'}</div>
                                                    </td>
                                                    <td className="py-2 px-3 text-xs font-mono text-gray-600">
                                                        <div>{row.email}</div>
                                                        <div>{row.phone}</div>
                                                    </td>
                                                    {viewMode === 'database' && (
                                                        <td className="py-2 px-3">
                                                            <div className="flex flex-wrap gap-1">
                                                                {(row.tags || []).map((tag: string, tIdx: number) => (
                                                                    <span key={tIdx} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] border border-gray-200">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Tag Modal */}
                    {showTagModal && (
                        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[60]">
                            <div className="bg-white p-4 rounded-xl shadow-xl w-64 animate-fade-in">
                                <h4 className="font-bold text-gray-800 mb-2">Nova Tag</h4>
                                <input
                                    autoFocus
                                    className="w-full border p-2 rounded mb-2 text-sm"
                                    placeholder="Ex: VIP, Quente..."
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => setShowTagModal(false)} className="flex-1 py-1 text-xs text-gray-500 bg-gray-100 rounded">Cancelar</button>
                                    <button onClick={handleAddTag} className="flex-1 py-1 text-xs text-white bg-purple-600 rounded">Salvar</button>
                                </div>
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
