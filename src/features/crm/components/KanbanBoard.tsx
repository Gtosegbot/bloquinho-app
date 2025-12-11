
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { KANBAN_COLUMNS, Deal } from '../types/crm.types';
import { Plus, User } from 'lucide-react';

const INITIAL_DEALS: Deal[] = [
    {
        id: '1', title: '5000 Panfletos A5', value: 450, customerId: 'c1', customerName: 'Padaria Central',
        status: 'lead', priority: 'high', createdAt: Date.now(), updatedAt: Date.now()
    },
    {
        id: '2', title: 'Fachada em ACM', value: 3200, customerId: 'c2', customerName: 'Loja de Roupas Elite',
        status: 'proposal', priority: 'medium', createdAt: Date.now(), updatedAt: Date.now()
    },
    {
        id: '3', title: '1000 Cartões Visita', value: 120, customerId: 'c3', customerName: 'Dr. João Silva',
        status: 'won', priority: 'low', createdAt: Date.now(), updatedAt: Date.now()
    },
];

export const KanbanBoard = () => {
    const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);

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

    return (
        <div className="h-full flex flex-col">
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
        </div>
    );
};
