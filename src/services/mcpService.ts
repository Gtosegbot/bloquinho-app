
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
    // Intelligence & Analytics
    ANALYTICS: `${WEBHOOK_BASE}/gestorTrafego`,
    MCP_SERVER: 'https://workflow.disparoseguro.com/mcp-server/http'
};

// Types for Payload Structures
export interface McpPayload {
    [key: string]: any;
}

export const mcpService = {
    /**
     * Initializes the connection to the MCP Server
     * This is a "handshake" to ensure the server is reachable and wake up the n8n instance
     */
    async init() {
        try {
            console.log("🔌 Initializing MCP Connection...");
            const response = await fetch(MCP_ENDPOINTS.MCP_SERVER, {
                method: 'GET', // Checks availability
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                console.log("✅ MCP Server Connected");
                return true;
            }
        } catch (error) {
            console.warn("⚠️ MCP Server Link skipped (Fallback to Webhook Mode):", error);
            // We don't throw here because we want to fallback to webhooks
            return false;
        }
    },

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
                    'Content-Type': 'application/json'
                    // Removed custom header to reduce CORS preflight issues
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`MCP Error ${response.status}: ${errorText || response.statusText}`);
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
     * Uses a simplified flat payload to ensure compatibility with n8n Webhook node
     * Uses a Batch Array pattern to match the n8n "Split In Batches" or compatible node structure.
     * Sending an array of objects allows n8n to process each email individually.
     */
    async sendEmailCampaign(campaignData: { subject: string; body: string; recipients: { name: string; email: string }[] }) {
        // Ensure initialization (fire and forget)
        this.init();

        // 1. Map each recipient to a simplified object matching standard Email Node parameters
        const payload = campaignData.recipients.map(client => ({
            // Matches 'MailBaby' and standard n8n node parameters
            toEmail: client.email,
            users: client.name,
            subject: campaignData.subject,
            // Personalized Message
            message: `Olá ${client.name ? client.name.split(' ')[0] : 'Cliente'},\n\n${campaignData.body}`,
            emailType: 'html',
            senderName: 'Disparo Seguro',
            replyTo: 'comercial@disparoseguro.com', // Best practice default

            // Metadata for tracking
            campaignName: campaignData.subject,
            options: {
                allowUnauthorizedCerts: false,
                ccEmail: "",
                bccEmail: "",
                replyTo: "comercial@disparoseguro.com",
                senderName: "Disparo Seguro"
            },
            timestamp: new Date().toISOString()
        }));

        // 2. Send the ARRAY. n8n will receive 'body' as [ { ... }, { ... } ]
        return this.call(MCP_ENDPOINTS.EMAIL, payload);
    },

    async sendWhatsApp(baseMessage: string, clients: { name: string; phone: string }[]) {
        this.init();

        const payload = clients.map(client => ({
            phone: client.phone,
            message: `Olá ${client.name ? client.name.split(' ')[0] : 'Cliente'}! ${baseMessage}`,
            timestamp: new Date().toISOString()
        }));

        return this.call(MCP_ENDPOINTS.WHATSAPP, payload);
    },

    async runScraper(url: string, instructions: string, tool: string = 'any') {
        this.init();
        return this.call(MCP_ENDPOINTS.SCRAPER, {
            url,
            prompt: instructions,
            tool
        });
    },

    async generateVideo(prompt: string, tech: 'veo3' | 'sora' | 'nano_banana', images: { name: string; data: string }[] = []) {
        this.init();
        return this.call(MCP_ENDPOINTS.SOCIAL_VIDEO, {
            prompt,
            tech_preference: tech,
            attachments: images
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
                    id: client.phone?.replace(/\D/g, '') || 'unknown',
                    name: client.name,
                    phone: client.phone,
                    email: client.email || null,
                    address: client.address || null,
                    city: client.city || null,
                    state: client.state || null,
                    country: client.country || null,
                    zip: client.zip || null,
                    dob: client.dob || null,
                    notes: client.notes || null,
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
