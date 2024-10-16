import amqp from "amqplib";
// import { captureException } from '@sentry/node'; // Optional if using Sentry for logging

export class RabbitMQConnection {
  constructor() {
    const { RABBIT_HOST, RABBIT_PORT, RABBIT_USERNAME, RABBIT_PASSWORD } =
      process.env;

    if (!RABBIT_HOST || !RABBIT_PORT || !RABBIT_USERNAME || !RABBIT_PASSWORD) {
      throw new Error("Missing RabbitMQ connection details in environment variables.");
    }

    this.rabbitHost = RABBIT_HOST;
    this.rabbitPort = parseInt(RABBIT_PORT, 10);
    this.rabbitUsername = RABBIT_USERNAME;
    this.rabbitPassword = RABBIT_PASSWORD;
    this.retryAttempts = 5;
    this.retryDelay = 2000;
  }

  // Utility to wait before retrying
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Attempt to connect to RabbitMQ with retries
  async createConnection() {
    let attempt = 0;
    while (attempt < this.retryAttempts) {
      try {
        console.log(`Attempting to connect to RabbitMQ... (Attempt ${attempt + 1})`);
        return await amqp.connect({
          hostname: this.rabbitHost,
          port: this.rabbitPort,
          username: this.rabbitUsername,
          password: this.rabbitPassword,
        });
      } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        attempt++;
        if (attempt >= this.retryAttempts) {
        //   captureException(error);
          throw new Error("Exceeded maximum connection attempts to RabbitMQ.");
        }
        console.log(`Retrying connection in ${this.retryDelay / 1000} seconds...`);
        await this.sleep(this.retryDelay);
      }
    }
  }
}
