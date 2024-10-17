import { Request, Response, NextFunction } from "express"; // Import types
import { MessageProducer } from "../services/MessageProducer.js"; // Adjusted import

export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messageSender = new MessageProducer();
    await messageSender.send(req.body);

    res.status(201).json({
      status: "OK",
      statusCode: 201,
      message: "Message successfully sent to RabbitMQ server.",
    });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};
