import { RabbitMQConnection } from "./RabbitMQConnection.js";
import * as Sentry from "@sentry/node";
import { Channel, Connection } from 'amqplib';
import { logError } from "../shareable/utils/errorLogger.js";

export class MessageProducer extends RabbitMQConnection {
  private readonly queueName: string = "wpp_queue";
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  public async send<T>(payload: T): Promise<void> {
    try {
      await this.ensureChannel();
      const data = JSON.stringify(payload);
      this.channel!.sendToQueue(this.queueName, Buffer.from(data), { persistent: true });
      console.log(`Message sent to ${this.queueName}:`, data);
    } catch (error: any) {
      logError("Failed to send message:", error);
      Sentry.captureException(error);
      throw error;
    }
  }

  private async ensureChannel(): Promise<void> {
    if (!this.connection) {
      this.connection = await this.createConnection();
    }
    if (!this.channel) {
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      console.log(`Closed connection and channel for queue ${this.queueName}`);
    } catch (error: any) {
      logError("Failed to close connection or channel:", error);
      Sentry.captureException(error);
      throw error;
    }
  }
}
