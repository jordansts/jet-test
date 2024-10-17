import { RabbitMQConnection } from "./RabbitMQConnection.js";

export class MessageProducer extends RabbitMQConnection {
  private queueName = "wpp_queue";

  async send(payload: unknown): Promise<void> {
    try {
      const connection = await this.createConnection();
      const channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      const data = JSON.stringify(payload);
      channel.sendToQueue(this.queueName, Buffer.from(data), { persistent: true });

      console.log(`Message sent to ${this.queueName}:`, data);
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }
}
