import Whatsapp from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = Whatsapp;

class WhatsAppClient {
    private client = new Client({ authStrategy: new LocalAuth() });
    private isReady = false;

    initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.on('qr', (qr: string) => {
                qrcode.generate(qr, { small: true });
            });

            this.client.on('ready', () => {
                console.log('WhatsApp Client is ready!');
                this.isReady = true;
                resolve();
            });

            this.client.on('auth_failure', (msg: string) => {
                console.error('Authentication failure:', msg);
                reject(new Error('WhatsApp authentication failed'));
            });

            this.client.on('disconnected', () => {
                console.log('WhatsApp client disconnected');
                this.isReady = false;
            });

            this.client.initialize();
        });
    }

    async sendMessageToNumber(number: string, text: string) {
        if (!this.isReady) {
            console.error('WhatsApp Client is not ready yet!');
            return;
        }

        const chatId = number.substring(1) + "@c.us";
        try {
            await this.client.sendMessage(chatId, text);
            console.log(`Message sent to ${number}: ${text}`);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    }
}

export default WhatsAppClient;
