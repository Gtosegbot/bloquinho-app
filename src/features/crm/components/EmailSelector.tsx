import { Check, AlignLeft, LayoutTemplate } from 'lucide-react';

interface EmailTemplate {
    id: string;
    name: string;
    preview: string;
    html: string;
    type: 'html' | 'text';
}

const TEMPLATES: EmailTemplate[] = [
    {
        id: 'simple-text',
        name: 'Texto Simples',
        type: 'text',
        preview: 'Olá [Nome], vi seu interesse...',
        html: ''
    },
    {
        id: 'promo-modern',
        name: 'Promoção Moderna (HTML)',
        type: 'html',
        preview: 'Oferta Especial com Botão de Ação',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center;">
                    <h1 style="color: #2563eb;">Oferta Exclusiva 🚀</h1>
                </div>
                <div style="padding: 20px;">
                    <p>Olá <strong>{{name}}</strong>,</p>
                    <p>Preparamos uma condição especial para você alavancar seu negócio.</p>
                    <a href="#" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Ver Oferta</a>
                </div>
                <div style="font-size: 12px; color: #999; text-align: center; padding: 20px;">
                    <p>Se não quiser mais receber emails, clique aqui.</p>
                </div>
            </div>
        `
    },
    {
        id: 'newsletter-clean',
        name: 'Newsletter Clean (HTML)',
        type: 'html',
        preview: 'Design minimalista para conteúdo',
        html: `
            <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
                <div style="padding: 30px;">
                    <h2 style="margin-top: 0;">Novidades da Semana</h2>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p>Olá {{name}}, aqui estão as últimas atualizações...</p>
                    <ul>
                        <li>Novos produtos chegaram</li>
                        <li>Dicas de marketing</li>
                    </ul>
                </div>
                <div style="background-color: #fafafa; padding: 15px; text-align: center; font-size: 11px;">
                    Enviado por Bloquinho App
                </div>
            </div>
        `
    },
    {
        id: 'urgent-alert',
        name: 'Alerta Urgente (HTML)',
        type: 'html',
        preview: 'Fundo amarelo e destaque',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border-left: 5px solid #eaa800; background-color: #fffbef;">
                <div style="padding: 20px;">
                    <h3 style="color: #b45309; margin-top: 0;">⚠️ Última Chamada</h3>
                    <p>Olá {{name}}, sua oportunidade expira em breve.</p>
                    <p>Não perca essa chance de garantir seu desconto.</p>
                </div>
            </div>
        `
    },
    {
        id: 'welcome-pack',
        name: 'Boas Vindas (HTML)',
        type: 'html',
        preview: 'Card de apresentação com foto',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
                <img src="https://via.placeholder.com/600x200" alt="Bem vindo" style="width: 100%; max-width: 600px;" />
                <div style="padding: 20px;">
                    <h1>Seja bem vindo, {{name}}!</h1>
                    <p>Estamos muito felizes em ter você conosco.</p>
                </div>
            </div>
        `
    }
];

interface EmailSelectorProps {
    onSelect: (template: EmailTemplate) => void;
    selectedId?: string;
}

export const EmailSelector = ({ onSelect, selectedId }: EmailSelectorProps) => {
    return (
        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2">
            {TEMPLATES.map(template => (
                <div
                    key={template.id}
                    onClick={() => onSelect(template)}
                    className={`
                        cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-4
                        ${selectedId === template.id
                            ? 'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                    `}
                >
                    <div className={`
                        p-2 rounded-lg shrink-0
                        ${template.type === 'html' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}
                    `}>
                        {template.type === 'html' ? <LayoutTemplate className="w-5 h-5" /> : <AlignLeft className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-sm font-semibold text-gray-900">{template.name}</h4>
                            {selectedId === template.id && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">{template.preview}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
