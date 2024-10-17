import express, { Request, Response, NextFunction } from "express";
import { sendMessage } from "../controllers/messageController.js";

const router = express.Router();

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message to RabbitMQ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+551199999999"
 *               messageText:
 *                 type: string
 *                 example: "Your Message Here"
 *     responses:
 *       201:
 *         description: Message successfully sent
 *       500:
 *         description: Failed to send message
 */
router.post("/send", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await sendMessage(req, res, next);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
