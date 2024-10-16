import { RabbitMQConnection } from "./RabbitMQConnection.js";

export class MessageConsumer extends RabbitMQConnection {
    constructor() {
      super();
      this.queueName = "wpp_queue";
    }
  
    async connectAndConsume() {
      let connection = null;
      let channel = null;
  
      try {
        connection = await this.createConnection();
        channel = await connection.createChannel();
        await channel.assertQueue(this.queueName, { durable: true });
  
        console.log(`Waiting for messages in ${this.queueName}...`);
  
        channel.consume(
          this.queueName,
          (msg) => {
            if (msg !== null) {
              const contents = JSON.parse(msg.content.toString());
              console.log("===== Received Message =====");
              console.log(contents);
            }
          },
          { noAck: true }
        );
      } catch (error) {
        console.error("Error connecting to RabbitMQ:", error);
        captureException(error);
      }
    }
  }
  