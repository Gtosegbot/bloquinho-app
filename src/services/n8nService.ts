
/**
 * Service to interact with n8n Webhooks and MCP
 */

const WEBHOOK_BASE = 'https://workwebhook.disparoseguro.com/webhook';

// Endpoints provided by user
const ENDPOINTS = {
    WHATSAPP: `${WEBHOOK_BASE}/send-whatsapp`, // Campaign Trigger
    EMAIL: `${WEBHOOK_BASE}/send-email`,
    SMS: `${WEBHOOK_BASE}/send-sms`,
    SCRAPER: `${WEBHOOK_BASE}/scrapers`,
    SOCIAL_VIDEO: `${WEBHOOK_BASE}/social`,
    NANO_ADS: `${WEBHOOK_BASE}/nanoVeo3`
};

interface CampaignPayload {
    campaignName: string;
    targetSegments?: string[];
    message?: string;
    clients?: any[]; // Array of client objects from CSV
}

export const n8nService = {
    /**
     * Triggers a WhatsApp campaign via n8n
     */
    triggerWhatsAppCampaign: async (payload: CampaignPayload) => {
        try {
            const response = await fetch(ENDPOINTS.WHATSAPP, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error('Failed to trigger workflow');
            
            return await response.json();
        } catch (error) {
            console.error('n8n Error:', error);
            throw error;
        }
    },

    /**
     * Generic trigger for other workflows
     */
    triggerWorkflow: async (type: keyof typeof ENDPOINTS, payload: any) => {
        const url = ENDPOINTS[type];
        if (!url) throw new Error(`Endpoint for ${type} not found`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error('Failed to trigger workflow');
            return await response.json();
        } catch (error) {
            console.error(`n8n ${type} Error:`, error);
            throw error;
        }
    }
};
