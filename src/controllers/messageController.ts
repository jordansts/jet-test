import { Request, Response, NextFunction } from "express";
import { MessageProducer } from "../services/MessageProducer.js";

export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const messageSender = new MessageProducer();
  try {
    await messageSender.send(req.body);
    res.status(201).json({ status: "OK", statusCode: 201, message: "Message successfully sent to RabbitMQ server." });
  } catch (error) {
    next(error);
  }
};
