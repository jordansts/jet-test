import express from "express";
import { MessageProducer } from "./MessageProducer.js";
import { MessageConsumer } from "./MessageConsumer.js";

// Initialize Express App
const app = express();
app.use(express.json({ limit: "50mb" }));

// Endpoint to send a message to RabbitMQ
app.post("/send", async (req, res) => {
  try {
    const messageSender = new MessageProducer();
    await messageSender.send(req.body);

    res.status(201).json({
      status: "OK",
      statusCode: 201,
      message: "Message successfully sent to RabbitMQ server.",
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      status: "ERROR",
      statusCode: 500,
      message: "Failed to send message to RabbitMQ.",
    });
  }
});

// Start Express Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`ExpressJS started on port ${PORT}`);
});

// Start RabbitMQ Consumer
const consumer = new MessageConsumer();
consumer.connectAndConsume();
