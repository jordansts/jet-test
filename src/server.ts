import app from "./app.js";
import { MessageConsumer } from "./services/MessageConsumer.js";
import dotenv from 'dotenv';
import WhatsAppClient from "./services/WhatsAppClient.js";

dotenv.config();

const API_PORT = process.env.API_PORT || 3000;

app.listen(API_PORT, () => {
  console.log(`ExpressJS started on port ${API_PORT}`);
});

const whatsappClient = new WhatsAppClient();
whatsappClient.initialize().then(() => {
  console.log("WhatsApp Client initialized and ready!");
  const consumer = new MessageConsumer(whatsappClient);
  consumer.connectAndConsume();
}).catch((error) => {
  console.error("Failed to initialize WhatsApp Client:", error);
});
