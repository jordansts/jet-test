import { RabbitMQConnection } from "./RabbitMQConnection.js";

export class MessageProducer extends RabbitMQConnection {
  constructor() {
    super();
    this.queueName = "wpp_queue";
  }

  async send(payload) {
    let connection = null;
    let channel = null;

    try {
      connection = await this.createConnection();
      channel = await connection.createChannel();
      await channel.assertQueue(this.queueName, { durable: true });

      const data = JSON.stringify(payload);
      channel.sendToQueue(this.queueName, Buffer.from(data), { persistent: true });

      console.log(`Message sent to ${this.queueName}:`, data);
    } catch (error) {
      console.error("Failed to send message:", error);
      captureException(error);
      throw error;
    } finally {
      if (channel) await channel.close();
      if (connection) await connection.close();
    }
  }
}
