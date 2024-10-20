import { Request, Response } from "express";
import { MessageQueueService } from "../services/MessageQueue.js";
import CreateMessageRequest from "../shareable/dtos/message/CreateMessageRequest.js";
import { logError } from "../shareable/utils/errorLogger.js";

class MessageController {
  
  public async sendMessage(req: Request, res: Response): Promise<void> {
    const { phone, message }: CreateMessageRequest = req.body as CreateMessageRequest;

    if (!phone || !message) {
      res.status(400).json({ error: "Invalid input data" });
      return;
    }

    try {
      await MessageQueueService.enqueueMessage({ phone, message });
      res.status(201).json({ message: "Message successfully sent" });
    } catch (error: any) {
      logError("Failed to send message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  }
}

export default new MessageController();
