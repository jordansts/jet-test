import { RabbitMQConnection } from "./RabbitMQConnection.js";
import { ConsumeMessage } from 'amqplib';
import WhatsAppClient from "./WhatsAppClient.js";

export class MessageConsumer extends RabbitMQConnection {
  private queueName: string;
  private whatsappClient: WhatsAppClient;

  constructor(whatsappClient: WhatsAppClient) {
    super();
    this.queueName = "wpp_queue";
    this.whatsappClient = whatsappClient;
  }

  async connectAndConsume(): Promise<void> {
    let connection = null;
    let channel = null;

    try {
      connection = await this.createConnection();
      channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      console.log(`Waiting for messages in ${this.queueName}...`);

      channel.consume(
        this.queueName,
        async (msg: ConsumeMessage | null) => {
          if (msg !== null) {
            const contents = JSON.parse(msg.content.toString());
            console.log("===== Received Message =====");
            console.log(contents);


            const { phoneNumber, messageText } = contents;


            if (phoneNumber && messageText) {
              await this.whatsappClient.sendMessageToNumber(phoneNumber, messageText);
            }


          }
        },
        { noAck: true }
      );
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
    }
  }
}
