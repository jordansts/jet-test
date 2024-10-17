import app from "./app.js";
import { MessageConsumer } from "./services/MessageConsumer.js";
import dotenv from 'dotenv';
import WhatsAppClient from "./services/WhatsAppClient.js";

dotenv.config(); // Load .env file contents into process.env

const API_PORT: number | string = process.env.API_PORT || 3000; // Type annotation for PORT

app.listen(API_PORT, () => {
  console.log(`ExpressJS started on port ${API_PORT}`);
});


// Start RabbitMQ Consumer
const whatsappClient = new WhatsAppClient();
whatsappClient.initialize().then(() => {
  console.log("WhatsApp Client initialized and ready!");

  // Start RabbitMQ Consumer with WhatsAppClient injected
  const consumer = new MessageConsumer(whatsappClient);
  consumer.connectAndConsume();
}).catch((error: Error) => {
  console.error("Failed to initialize WhatsApp Client:", error);
});