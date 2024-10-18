import api from './api/api.js';
import { MessageConsumer } from './services/MessageConsumer.js';
import dotenv from 'dotenv';
import WhatsAppClient from './services/WhatsAppClient.js';
import * as Sentry from '@sentry/node';

dotenv.config();

class App {
  private apiPort: string | number;
  private whatsAppClient: WhatsAppClient;
  private messageConsumer!: MessageConsumer;

  constructor() {
    this.apiPort = process.env.API_PORT || 3000;
    this.whatsAppClient = new WhatsAppClient();
  }

  public start() {
    this.startApi();
    this.startWhatsAppClient();
  }

  private startApi() {
    api.listen(this.apiPort, () => {
      console.log(`ExpressJS Started | PORT: ${this.apiPort}`);
    });
  }

  private async startWhatsAppClient() {
    try {
      await this.whatsAppClient.initialize();
      console.log('WhatsApp Client Started');
      this.messageConsumer = new MessageConsumer(this.whatsAppClient);
      this.messageConsumer.connectAndConsume();
    } catch (error) {
      console.error('Failed to initialize WhatsApp Client:', error);
      Sentry.captureException(error);
    }
  }
}

const app = new App();
app.start();
