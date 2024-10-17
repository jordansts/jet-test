import { RabbitMQConnection } from "./RabbitMQConnection.js"; // Adjusted import
// import { captureException } from '@sentry/node'; // Uncomment if using Sentry for error tracking

export class MessageProducer extends RabbitMQConnection {
  private queueName: string; // Type annotation for queueName

  constructor() {
    super();
    this.queueName = "wpp_queue";
  }

  async send(payload: any): Promise<void> { // Add type annotation for payload and return type
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
      // captureException(error); // Uncomment if using Sentry for error tracking
      throw error;
    } finally {
      if (channel) await channel.close();
      if (connection) await connection.close();
    }
  }
}
