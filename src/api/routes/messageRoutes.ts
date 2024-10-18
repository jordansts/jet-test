import express from "express";
import MessageController from "../../controllers/MessageController.js"

const router = express.Router();

/**
 * @swagger
 * /api/send-message:
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
router.post("/send-message", MessageController.sendMessage.bind(MessageController));

export default router;
