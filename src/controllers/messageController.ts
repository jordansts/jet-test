import { Request, Response } from "express";
import { MessageQueueService } from "../services/MessageQueue.js";
import CreateMessageRequest from "../shareable/dtos/message/CreateMessageRequest.js";

class MessageController {
  
  public async sendMessage(req: Request, res: Response): Promise<void> {
    const { phoneNumber, messageText }: CreateMessageRequest = req.body as CreateMessageRequest;

    if (!phoneNumber || !messageText) {
      res.status(400).json({ error: "Invalid input data" });
      return;
    }

    try {
      await MessageQueueService.enqueueMessage({ phoneNumber, messageText });
      res.status(201).json({ message: "Message successfully sent" });
    } catch (error) {
      console.error("Failed to send message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  }
}

export default new MessageController();
