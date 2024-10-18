import amqp, { Connection } from "amqplib";
import * as Sentry from "@sentry/node";

export class RabbitMQConnection {
  private rabbitHost: string;
  private rabbitPort: number;
  private rabbitUsername: string;
  private rabbitPassword: string;
  private readonly retryAttempts = 5;
  private readonly retryDelay = 2000;

  constructor() {
    const { RABBIT_HOST, RABBIT_PORT, RABBIT_USERNAME, RABBIT_PASSWORD } = process.env;

    if (!RABBIT_HOST || !RABBIT_PORT || !RABBIT_USERNAME || !RABBIT_PASSWORD) {
      const error = new Error("Missing RabbitMQ connection details in environment variables.");
      Sentry.captureException(error);
      throw error;
    }

    this.rabbitHost = RABBIT_HOST;
    this.rabbitPort = Number(RABBIT_PORT);
    this.rabbitUsername = RABBIT_USERNAME;
    this.rabbitPassword = RABBIT_PASSWORD;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async createConnection(): Promise<Connection> {
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        return await amqp.connect({
          hostname: this.rabbitHost,
          port: this.rabbitPort,
          username: this.rabbitUsername,
          password: this.rabbitPassword,
        });
      } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        Sentry.captureException(error);
        
        if (attempt === this.retryAttempts - 1) {
          const finalError = new Error("Exceeded maximum connection attempts to RabbitMQ.");
          Sentry.captureException(finalError);
          throw finalError;
        }

        console.log(`Retrying connection in ${this.retryDelay / 1000} seconds...`);
        await this.sleep(this.retryDelay);
      }
    }
    const fallbackError = new Error("Connection failed after retries.");
    Sentry.captureException(fallbackError);
    throw fallbackError;
  }
}
