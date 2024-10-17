import { RabbitMQConnection } from "./RabbitMQConnection.js";
import { ConsumeMessage } from 'amqplib';
import WhatsAppClient from "./WhatsAppClient.js";

export class MessageConsumer extends RabbitMQConnection {
  private queueName = "wpp_queue";
  private whatsappClient: WhatsAppClient;

  constructor(whatsappClient: WhatsAppClient) {
    super();
    this.whatsappClient = whatsappClient;
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
            await this.whatsappClient.sendMessageToNumber(phoneNumber, messageText);
          }
        }
      }, { noAck: true });
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
    }
  }
}
