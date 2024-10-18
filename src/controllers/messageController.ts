import { Request, Response, NextFunction } from "express";
import { MessageQueueService } from "../services/MessageQueue.js";
import * as Sentry from "@sentry/node";

export const sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { phoneNumber, messageText } = req.body;

  try {
    await MessageQueueService.enqueueMessage({ phoneNumber, messageText });

    res.status(201).json({
      status: "OK",
      statusCode: 201,
      message: "Message successfully enqueued for processing."
    });
  } catch (error) {
    Sentry.captureException(error);
    next(error);
  }
};
