import { RabbitMQConnection } from "./RabbitMQConnection.js";
import { ConsumeMessage } from 'amqplib';
import WhatsAppClient from "./WhatsAppClient.js";
import * as Sentry from "@sentry/node";
import { MessageRepository } from "../infra/repositories/MessageRepository.js";
import CreateMessageRequest from "../shareable/dtos/message/CreateMessageRequest.js";

export class MessageConsumer extends RabbitMQConnection {
  private queueName = "wpp_queue";
  private whatsappClient: WhatsAppClient;
  private messageRepository: MessageRepository;

  constructor(whatsappClient: WhatsAppClient) {
    super();
    this.whatsappClient = whatsappClient;
    this.messageRepository = new MessageRepository();
  }

  async connectAndConsume(): Promise<void> {
    try {
      const connection = await this.createConnection();
      const channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      console.log(`Waiting for messages in ${this.queueName}...`);

      channel.consume(this.queueName, async (msg: ConsumeMessage | null) => {
        if (msg) {
          const { phoneNumber, messageText } = JSON.parse(msg.content.toString());
          console.log("Received Message:", { phoneNumber, messageText });

          if (phoneNumber && messageText) {
            try {
              const createMessageRequest: CreateMessageRequest = { phoneNumber, messageText };
              await this.messageRepository.createMessage(createMessageRequest);
              await this.whatsappClient.sendMessageToNumber(phoneNumber, messageText);
            } catch (sendError) {
              console.error("Failed to send message:", sendError);
              Sentry.captureException(sendError);
            }
          }
        }
      }, { noAck: true });
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      Sentry.captureException(error);
    }
  }
}
