import {
    collection,
    addDoc,
    updateDoc,
    doc,
    getDocs,
    query,
    getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Deal, Customer } from '../features/crm/types/crm.types';

const DEALS_COLLECTION = 'deals';
const CUSTOMERS_COLLECTION = 'customers';

export const crmService = {
    /**
     * Creates a new Deal in Firestore
     */
    async createDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) {
        try {
            const docRef = await addDoc(collection(db, DEALS_COLLECTION), {
                ...deal,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                paymentStatus: deal.paymentStatus || 'pending',
                amountPaid: deal.amountPaid || 0,
                history: [{
                    date: new Date().toISOString(),
                    action: 'Deal Created',
                    actor: 'system',
                    details: 'Initial creation via Marketing Hub/Import'
                }]
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating deal:", error);
            throw error;
        }
    },

    /**
     * Fetches all deals
     */
    async getDeals(): Promise<Deal[]> {
        try {
            const q = query(collection(db, DEALS_COLLECTION));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Deal));
        } catch (error) {
            console.error("Error fetching deals:", error);
            return [];
        }
    },

    /**
     * Updates deal status (Kanban column move)
     */
    async updateDealStatus(dealId: string, newStatus: Deal['status']) {
        try {
            const dealRef = doc(db, DEALS_COLLECTION, dealId);
            await updateDoc(dealRef, {
                status: newStatus,
                updatedAt: Date.now()
            });
        } catch (error) {
            console.error("Error updating deal status:", error);
            throw error;
        }
    },

    /**
     * Updates Financial Information (Payment confirmation)
     * Handles the logic for "50/50" split or full payments.
     */
    async registerPayment(dealId: string, amount: number, actor: 'user' | 'external_bot' | 'internal_coach' = 'user') {
        try {
            const dealRef = doc(db, DEALS_COLLECTION, dealId);
            const dealSnap = await getDoc(dealRef);

            if (!dealSnap.exists()) throw new Error("Deal not found");

            const dealData = dealSnap.data() as Deal;
            const newAmountPaid = (dealData.amountPaid || 0) + amount;
            const totalValue = dealData.value;

            let newPaymentStatus: Deal['paymentStatus'] = 'pending';

            if (newAmountPaid >= totalValue) {
                newPaymentStatus = 'paid';
            } else if (newAmountPaid > 0) {
                newPaymentStatus = 'partial';
            }

            const historyEntry = {
                date: new Date().toISOString(),
                action: 'Payment Received',
                actor,
                details: `Received R$${amount}. Total Paid: R$${newAmountPaid}/${totalValue}`
            };

            await updateDoc(dealRef, {
                amountPaid: newAmountPaid,
                paymentStatus: newPaymentStatus,
                updatedAt: Date.now(),
                history: [...(dealData.history || []), historyEntry]
            });

            return { newAmountPaid, newPaymentStatus };
        } catch (error) {
            console.error("Error registering payment:", error);
            throw error;
        }
    },

    /**
     * Creates a customer from CSV row if it doesn't exist
     */
    async syncCustomer(customerData: Partial<Customer>) {
        // Logic to check duplicates would go here (by email/phone)
        // For now, simple add
        // In a real app, we'd query first.
        try {
            const docRef = await addDoc(collection(db, CUSTOMERS_COLLECTION), {
                ...customerData,
                createdAt: Date.now()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error syncing customer:", error);
            return null;
        }
    }
};
