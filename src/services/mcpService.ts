
/**
 * Unified MCP Client Service
 * Connects Bloquinho App to n8n AI Agents & Workflows
 */

// Base Webhook URL from requirements
const WEBHOOK_BASE = 'https://workwebhook.disparoseguro.com/webhook';

// Centralized Endpoint Registry
export const MCP_ENDPOINTS = {
    // Communication & Messaging
    WHATSAPP: `${WEBHOOK_BASE}/send-whatsapp`,
    EMAIL: `${WEBHOOK_BASE}/send-email`,
    SMS: `${WEBHOOK_BASE}/send-sms`,

    // Content Generation & Marketing
    SCRAPER: `${WEBHOOK_BASE}/scrapers`,
    SOCIAL_VIDEO: `${WEBHOOK_BASE}/social`,      // Sora vs VEO3 decided by AI/User
    NANO_ADS: `${WEBHOOK_BASE}/nanoVeo3`,        // Image Ads

    // Intelligence & Analytics
    ANALYTICS: `${WEBHOOK_BASE}/gestorTrafego`,   // Traffic Manager AI
    MCP_SERVER: 'https://workflow.disparoseguro.com/mcp-server/http' // Advanced Bidirectional MCP
};

// Types for Payload Structures
export interface McpPayload {
    [key: string]: any;
}

export const mcpService = {
    /**
     * Generic MCP Trigger (POST)
     * Handles the communication with n8n webhooks
     */
    async call(endpoint: string, payload: McpPayload) {
        try {
            console.log(`🔌 MCP Call to [${endpoint}]`, payload);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-id': 'bloquinho-app-v1'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`MCP Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('❌ MCP Execution Failed:', error);
            throw error;
        }
    },

    // --- Specialized Action Methods ---

    /**
     * Triggers the "Hybrid MCP" for advanced Email Campaigns
     * Uses the specific JSON structure requested for the internal MCP server if needed,
     * or falls back to the standard webhook if 'simple' mode is preferred.
     */
    async sendEmailCampaign(campaignData: { subject: string; body: string; recipients: string[] }) {
        // Using the standard webhook as the primary stable method based on "Reforçando..." instruction
        return this.call(MCP_ENDPOINTS.EMAIL, {
            campaignName: campaignData.subject,
            subject: campaignData.subject,
            html: campaignData.body,
            to: campaignData.recipients,
            type: 'campanha-ativa'
        });
    },

    async sendWhatsApp(message: string, phones: string[]) {
        return this.call(MCP_ENDPOINTS.WHATSAPP, {
            message,
            phones,
            timestamp: new Date().toISOString()
        });
    },

    async runScraper(url: string, instructions: string) {
        return this.call(MCP_ENDPOINTS.SCRAPER, {
            url,
            prompt: instructions
        });
    },

    async generateVideo(prompt: string, tech: 'veo3' | 'sora' | 'nano_banana') {
        return this.call(MCP_ENDPOINTS.SOCIAL_VIDEO, {
            prompt,
            tech_preference: tech
        });
    },

    /**
     * Triggers the "Hybrid MCP" for SMS Campaigns
     * Structure replicates the nested body array pattern requested by the user.
     */
    async sendSMSCampaign(campaignName: string, message: string, clients: any[]) {
        const timestamp = new Date().toISOString();
        const campaignId = `sms-${Date.now()}`;

        // Map clients to the specific "body" structure requested
        const payload = clients.map((client, index) => ({
            headers: {
                "content-type": "application/json",
                "user-agent": "Disparo-Seguro-SMS-Dispatcher/1.0"
            },
            body: {
                campaignId,
                campaignName,
                targetAudience: `SMS: ${clients.length} recipients`,
                timestamp,
                message,
                from_name: "Disparo Seguro",
                brand_name: "Disparo Seguro",
                lead_details: {
                    id: client.phone.replace(/\D/g, ''), // Ensure numeric ID
                    name: client.name,
                    phone: client.phone,
                    email: client.email || null,
                    tags: [],
                    value: 0
                },
                metadata: {
                    sessionId: `session-${campaignId}-${index}`
                }
            },
            webhookUrl: MCP_ENDPOINTS.SMS,
            executionMode: "production"
        }));

        // The user example shows the entire batch wrapped in an array, 
        // effectively sending [ { item1 }, { item2 } ]
        return this.call(MCP_ENDPOINTS.SMS, payload);
    }
};
