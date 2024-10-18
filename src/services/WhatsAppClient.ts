import Whatsapp from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';
import * as Sentry from "@sentry/node";

const { Client, LocalAuth } = Whatsapp;

class WhatsAppClient {
    private client;
    private isReady = false;

    constructor() {
        this.client = new Client({ authStrategy: new LocalAuth() });
    }

    initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.on('qr', (qr: string) => {
                qrcode.generate(qr, { small: true });
            });

            this.client.on('ready', () => {
                this.isReady = true;
                resolve();
            });

            this.client.on('auth_failure', (msg: string) => {
                console.error('Authentication failure:', msg);
                Sentry.captureException(new Error('WhatsApp authentication failed'));
                reject(new Error('WhatsApp authentication failed'));
            });

            this.client.on('disconnected', () => {
                console.log('WhatsApp client disconnected');
                this.isReady = false;
            });

            this.client.initialize();
        });
    }

    async sendMessageToNumber(number: string, text: string): Promise<void> {
        if (!this.isReady) {
            console.error('WhatsApp Client is not ready yet!');
            return;
        }

        const chatId = `${number.substring(1)}@c.us`;
        try {
            await this.client.sendMessage(chatId, text);
            console.log(`Message sent to ${number}: ${text}`);
        } catch (err) {
            console.error('Failed to send message:', err);
            Sentry.captureException(err);
        }
    }
}

export default WhatsAppClient;
