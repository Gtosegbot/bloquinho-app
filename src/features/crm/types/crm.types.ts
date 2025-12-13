
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  createdAt: number;
  // Extended fields for import
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  dob?: string;
  notes?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  customerId: string;
  customerName: string;
  status: 'lead' | 'contact' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  updatedAt: number;
  notes?: string;
  description?: string;
  customerPhone?: string;
  customerEmail?: string;
  // Financial Control
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
  paymentTerms: 'full' | '50_50' | 'negotiated';
  amountPaid: number;
  nextPaymentDate?: string;
  paymentNotes?: string; // For custom terms like "40/60" or "Pay on Pickup"
  // Audit Log for Dual LLM context
  history?: {
    date: string;
    action: string;
    actor: 'system' | 'user' | 'external_bot' | 'internal_coach';
    details?: string;
  }[];
}

export interface KanbanColumn {
  id: Deal['status'];
  title: string;
  color: string;
}

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'lead', title: 'Novos Leads (Chegando)', color: 'gray' },
  { id: 'contact', title: 'Em Contato', color: 'blue' },
  { id: 'proposal', title: 'Orçamento Enviado', color: 'yellow' },
  { id: 'negotiation', title: 'Em Negociação', color: 'purple' },
  { id: 'won', title: 'Fechado / Produção', color: 'green' },
  { id: 'lost', title: 'Perdido / Arquivado', color: 'red' },
];
