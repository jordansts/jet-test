import amqp, { Connection, Options } from "amqplib";
import * as Sentry from "@sentry/node";
import { logError } from "../shareable/utils/errorLogger.js";

export class RabbitMQConnection {
  private readonly rabbitHost: string;
  private readonly rabbitPort: number;
  private readonly rabbitUsername: string;
  private readonly rabbitPassword: string;
  private readonly retryAttempts: number = 5;
  private readonly retryDelay: number = 2000;

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

  public async createConnection(): Promise<Connection> {
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const connection = await this.connectToRabbitMQ();
        console.log(`Connected to RabbitMQ on attempt ${attempt + 1}`);
        return connection;
      } catch (error: any) {
        logError(`Connection attempt ${attempt + 1} failed:`, error);
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

  private async connectToRabbitMQ(): Promise<Connection> {
    const connectionOptions: Options.Connect = {
      hostname: this.rabbitHost,
      port: this.rabbitPort,
      username: this.rabbitUsername,
      password: this.rabbitPassword,
    };

    return await amqp.connect(connectionOptions);
  }
}
