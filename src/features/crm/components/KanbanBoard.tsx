
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { KANBAN_COLUMNS, Deal } from '../types/crm.types';
import { Plus, User } from 'lucide-react';

const INITIAL_DEALS: Deal[] = [
    {
        id: '1', title: '5000 Panfletos A5', value: 450, customerId: 'c1', customerName: 'Padaria Central',
        status: 'lead', priority: 'high', createdAt: Date.now(), updatedAt: Date.now(),
        paymentStatus: 'pending', paymentTerms: 'full', amountPaid: 0
    },
    {
        id: '2', title: 'Fachada em ACM', value: 3200, customerId: 'c2', customerName: 'Loja de Roupas Elite',
        status: 'proposal', priority: 'medium', createdAt: Date.now(), updatedAt: Date.now(),
        paymentStatus: 'partial', paymentTerms: '50_50', amountPaid: 1600
    },
    {
        id: '3', title: '1000 Cartões Visita', value: 120, customerId: 'c3', customerName: 'Dr. João Silva',
        status: 'won', priority: 'low', createdAt: Date.now(), updatedAt: Date.now(),
        paymentStatus: 'paid', paymentTerms: 'full', amountPaid: 120
    },
];

export const KanbanBoard = () => {
    const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const updatedDeals = deals.map(deal =>
            deal.id === draggableId
                ? { ...deal, status: destination.droppableId as Deal['status'] }
                : deal
        );
        setDeals(updatedDeals);
    };

    const handleSaveDeal = (updatedDeal: Deal) => {
        setDeals(deals.map(d => d.id === updatedDeal.id ? updatedDeal : d));
        setSelectedDeal(null);
    };

    return (
        <div className="h-full flex flex-col relative">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Funil de Vendas</h1>
                    <p className="text-gray-500">Gerencie seus leads desde o primeiro contato até o fechamento.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                    <Plus className="w-4 h-4" />
                    Novo Negócio
                </button>
            </header>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
                    {KANBAN_COLUMNS.map(column => {
                        const columnDeals = deals.filter(deal => deal.status === column.id);
                        const totalValue = columnDeals.reduce((sum, deal) => sum + deal.value, 0);

                        return (
                            <div key={column.id} className="min-w-[300px] w-[300px] flex flex-col bg-gray-100 rounded-xl max-h-full">
                                <div className={`p-3 border-b border-gray-200 flex justify-between items-center bg-${column.color}-50 rounded-t-xl`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full bg-${column.color}-500`}></div>
                                        <h3 className="font-semibold text-gray-700">{column.title}</h3>
                                        <span className="bg-white px-2 py-0.5 rounded-full text-xs text-gray-500 font-medium">
                                            {columnDeals.length}
                                        </span>
                                    </div>
                                </div>
                                <div className="px-3 py-2 bg-white/50 border-b border-gray-100 text-xs text-gray-500 font-medium flex justify-between">
                                    <span>Total:</span>
                                    <span className="text-gray-900">
                                        {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 p-2 overflow-y-auto space-y-2 transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                                        >
                                            {columnDeals.map((deal, index) => (
                                                <Draggable key={deal.id} draggableId={deal.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => setSelectedDeal(deal)}
                                                            className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide
                                                                    ${deal.priority === 'high' ? 'bg-red-100 text-red-600' :
                                                                        deal.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                                                            'bg-green-100 text-green-600'}`}>
                                                                    {deal.priority === 'high' ? 'Alta' : deal.priority === 'medium' ? 'Média' : 'Baixa'}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-medium text-gray-800 mb-1 leading-tight">{deal.title}</h4>
                                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                                                <User className="w-3 h-3" />
                                                                {deal.customerName}
                                                            </div>
                                                            {deal.paymentStatus && deal.paymentStatus !== 'pending' && (
                                                                <div className="mb-2">
                                                                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono
                                                                        ${deal.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                                            deal.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                        {deal.paymentStatus === 'paid' ? 'Pago' :
                                                                            deal.paymentStatus === 'partial' ? `Restam ${((deal.value - (deal.amountPaid || 0))).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : ''}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                                                <div className="text-sm font-bold text-gray-900">
                                                                    {deal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                                </div>
                                                                <span className="text-[10px] text-gray-400">
                                                                    {new Date(deal.updatedAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>

            {/* Edit Modal */}
            {selectedDeal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Editar Negócio</h2>
                            <button onClick={() => setSelectedDeal(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Projeto</label>
                                <input
                                    type="text"
                                    value={selectedDeal.title}
                                    onChange={e => setSelectedDeal({ ...selectedDeal, title: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total (R$)</label>
                                    <input
                                        type="number"
                                        value={selectedDeal.value}
                                        onChange={e => setSelectedDeal({ ...selectedDeal, value: Number(e.target.value) })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                                    <select
                                        value={selectedDeal.priority}
                                        onChange={e => setSelectedDeal({ ...selectedDeal, priority: e.target.value as any })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="low">Baixa</option>
                                        <option value="medium">Média</option>
                                        <option value="high">Alta</option>
                                    </select>
                                </div>
                            </div>

                            {/* Financial Control Section */}
                            <div className="p-4 bg-green-50 rounded-lg space-y-3 border border-green-100">
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    💰 Controle Financeiro
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Termos</label>
                                        <select
                                            value={selectedDeal.paymentTerms || 'full'}
                                            onChange={e => setSelectedDeal({ ...selectedDeal, paymentTerms: e.target.value as any })}
                                            className="w-full p-2 text-sm border border-gray-200 rounded lg outline-none"
                                        >
                                            <option value="full">À Vista (100%)</option>
                                            <option value="50_50">50% / 50%</option>
                                            <option value="negotiated">Negociado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Status Pagamento</label>
                                        <select
                                            value={selectedDeal.paymentStatus || 'pending'}
                                            onChange={e => setSelectedDeal({ ...selectedDeal, paymentStatus: e.target.value as any })}
                                            className="w-full p-2 text-sm border border-gray-200 rounded lg outline-none"
                                        >
                                            <option value="pending">Pendente</option>
                                            <option value="partial">Parcial</option>
                                            <option value="paid">Pago</option>
                                            <option value="overdue">Atrasado</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Valor Pago (R$)</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            value={selectedDeal.amountPaid || 0}
                                            onChange={e => setSelectedDeal({ ...selectedDeal, amountPaid: Number(e.target.value) })}
                                            className="flex-1 p-2 text-sm border border-gray-200 rounded lg outline-none"
                                        />
                                        <div className="text-xs text-gray-500">
                                            Restante: <span className="font-bold text-red-500">
                                                {((selectedDeal.value || 0) - (selectedDeal.amountPaid || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Observações Financeiras (Ex: "Pagar na retirada", "40/60")</label>
                                        <input
                                            type="text"
                                            value={selectedDeal.paymentNotes || ''}
                                            onChange={e => setSelectedDeal({ ...selectedDeal, paymentNotes: e.target.value })}
                                            className="w-full p-2 text-sm border border-gray-200 rounded lg outline-none placeholder-gray-400"
                                            placeholder="Detalhes da negociação..."
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Dados do Cliente
                                    </h3>
                                    <input
                                        placeholder="Nome do Cliente"
                                        value={selectedDeal.customerName}
                                        onChange={e => setSelectedDeal({ ...selectedDeal, customerName: e.target.value })}
                                        className="w-full p-2 text-sm border border-gray-200 rounded lg outline-none"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            placeholder="Telefone / WhatsApp"
                                            value={selectedDeal.customerPhone || ''}
                                            onChange={e => setSelectedDeal({ ...selectedDeal, customerPhone: e.target.value })}
                                            className="w-full p-2 text-sm border border-gray-200 rounded lg outline-none"
                                        />
                                        <input
                                            placeholder="Email"
                                            value={selectedDeal.customerEmail || ''}
                                            onChange={e => setSelectedDeal({ ...selectedDeal, customerEmail: e.target.value })}
                                            className="w-full p-2 text-sm border border-gray-200 rounded lg outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Detalhes / Notas</label>
                                    <textarea
                                        rows={3}
                                        value={selectedDeal.description || ''}
                                        onChange={e => setSelectedDeal({ ...selectedDeal, description: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        placeholder="Descreva o pedido..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setSelectedDeal(null)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                                    <button onClick={() => handleSaveDeal(selectedDeal)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Salvar Alterações</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
