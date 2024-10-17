import express, { Request, Response, NextFunction } from "express";
import { sendMessage } from "../controllers/messageController.js";

const router = express.Router();

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message to RabbitMQ to be redirected for WhatsApp
 *     description: This endpoint sends a message to RabbitMQ.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+550012345678"
 *               messageText:
 *                 type: string
 *                 example: "Send the message text here"
 *     responses:
 *       200:
 *         description: Message successfully sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Message sent successfully"
 *       500:
 *         description: Failed to send message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to send message"
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
