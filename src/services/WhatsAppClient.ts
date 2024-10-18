import Whatsapp, { Client as WhatsAppClientInstance } from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';
import * as Sentry from "@sentry/node";
import { logError } from "../shareable/utils/errorLogger.js";

const { LocalAuth } = Whatsapp;

class WhatsAppClient {
    private client: WhatsAppClientInstance;
    private isReady: boolean = false;

    constructor() {
        this.client = new Whatsapp.Client({ authStrategy: new LocalAuth() });
    }

    public initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.on('qr', this.handleQrCode);
            this.client.on('ready', () => this.handleReady(resolve));
            this.client.on('auth_failure', (msg: string) => this.handleAuthFailure(msg, reject));
            this.client.on('disconnected', this.handleDisconnection);
            
            this.client.initialize();
        });
    }

    private handleQrCode(qr: string): void {
        qrcode.generate(qr, { small: true });
    }

    private handleReady(resolve: () => void): void {
        this.isReady = true;
        console.log('WhatsApp client is ready');
        resolve();
    }

    private handleAuthFailure(msg: string, reject: (reason?: any) => void): void {
        console.error('Authentication failure:', msg);
        Sentry.captureException(new Error('WhatsApp authentication failed'));
        reject(new Error('WhatsApp authentication failed'));
    }

    private handleDisconnection(): void {
        console.log('WhatsApp client disconnected');
        this.isReady = false;
    }

    public async sendMessageToNumber(number: string, text: string): Promise<void> {
        if (!this.isReady) {
            console.error('WhatsApp Client is not ready yet!');
            return;
        }

        const chatId = `${number.substring(1)}@c.us`;
        try {
            await this.client.sendMessage(chatId, text);
            console.log(`Message sent to ${number}: ${text}`);
        } catch (error: any) {
            logError('Failed to send message:', error);
            Sentry.captureException(error);
        }
    }
}

export default WhatsAppClient;
