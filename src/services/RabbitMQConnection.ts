import amqp, { Connection } from "amqplib";

export class RabbitMQConnection {
  private rabbitHost: string;
  private rabbitPort: number;
  private rabbitUsername: string;
  private rabbitPassword: string;
  private retryAttempts = 5;
  private retryDelay = 2000;

  constructor() {
    const { RABBIT_HOST, RABBIT_PORT, RABBIT_USERNAME, RABBIT_PASSWORD } = process.env;

    if (!RABBIT_HOST || !RABBIT_PORT || !RABBIT_USERNAME || !RABBIT_PASSWORD) {
      throw new Error("Missing RabbitMQ connection details in environment variables.");
    }

    this.rabbitHost = RABBIT_HOST;
    this.rabbitPort = parseInt(RABBIT_PORT, 10);
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
        if (attempt === this.retryAttempts - 1) {
          throw new Error("Exceeded maximum connection attempts to RabbitMQ.");
        }
        console.log(`Retrying connection in ${this.retryDelay / 1000} seconds...`);
        await this.sleep(this.retryDelay);
      }
    }
    throw new Error("Connection failed"); // Fallback error in case of unexpected behavior
  }
}
