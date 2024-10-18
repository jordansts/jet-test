import { RabbitMQConnection } from "./RabbitMQConnection.js";
import { ConsumeMessage } from 'amqplib';
import WhatsAppClient from "./WhatsAppClient.js";
import * as Sentry from "@sentry/node";
import { MessageRepository } from "../infra/repositories/MessageRepository.js";
import CreateMessageRequest from "../shareable/dtos/message/CreateMessageRequest.js";
import { logError } from "../shareable/utils/errorLogger.js";

export class MessageConsumer extends RabbitMQConnection {
  private readonly queueName: string = "wpp_queue";
  private readonly whatsappClient: WhatsAppClient;
  private readonly messageRepository: MessageRepository;

  constructor(whatsappClient: WhatsAppClient, messageRepository: MessageRepository) {
    super();
    this.whatsappClient = whatsappClient;
    this.messageRepository = messageRepository;
  }

  async connectAndConsume(): Promise<void> {
    try {
      const connection = await this.createConnection();
      const channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      console.log(`Waiting for messages in ${this.queueName}...`);

      channel.consume(
        this.queueName, 
        async (msg: ConsumeMessage | null) => {
          if (msg) {
            const { phoneNumber, messageText } = this.parseMessage(msg);
            console.log("Received Message:", { phoneNumber, messageText });

            if (this.isValidMessage(phoneNumber, messageText)) {
              await this.handleMessage({ phoneNumber, messageText });
            }
          }
        }, 
        { noAck: true }
      );
    } catch (error: any) {
      logError("Error connecting to RabbitMQ:", error);
      Sentry.captureException(error);
    }
  }

  private parseMessage(msg: ConsumeMessage): CreateMessageRequest {
    return JSON.parse(msg.content.toString()) as CreateMessageRequest;
  }

  private isValidMessage(phoneNumber: string, messageText: string): boolean {
    return Boolean(phoneNumber && messageText);
  }

  private async handleMessage(createMessageRequest: CreateMessageRequest): Promise<void> {
    const { phoneNumber, messageText } = createMessageRequest;
    try {
      await this.messageRepository.createMessage(createMessageRequest);
      await this.whatsappClient.sendMessageToNumber(phoneNumber, messageText);
    } catch (error: any) {
      logError("Failed to send message:", error);
      Sentry.captureException(error);
    }
  }
}
