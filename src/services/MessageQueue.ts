import Queue from "bull";
import { MessageProducer } from "./MessageProducer.js";
import * as Sentry from "@sentry/node";

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
};

const messageQueue = new Queue('messageQueue', { redis: redisConfig });

export interface MessagePayload {
    phone: string;
    message: string;
}

export class MessageQueueService {

    static validatePayload(payload: MessagePayload): void {
        const { phone, message } = payload;

        if (!phone || typeof phone !== 'string') {
            throw new Error(`Invalid phone number: ${phone}`);
        }

        if (!message || typeof message !== 'string') {
            throw new Error(`Invalid message text: ${message}`);
        }
    }

    static async enqueueMessage(payload: MessagePayload): Promise<void> {
        try {
            console.log(payload)
            this.validatePayload(payload);
            await messageQueue.add(payload, { delay: 5000 });
        } catch (error) {
            console.error("Failed to enqueue message");
            Sentry.captureException(error);
            throw error;
        }
    }

    static processQueue(): void {
        messageQueue.process(async (job) => {
            const { phone, message } = job.data;
            const messageSender = new MessageProducer();

            try {
                await messageSender.send({ phone, message });
                console.log(`Message sent to ${phone}`);
            } catch (error) {
                console.error("Error sending message:", error);
                Sentry.captureException(error);
                throw new Error("Failed to send message");
            }
        });
    }

    static async closeConnection(): Promise<void> {
        console.log("All messages processed. Closing connection...");
        await messageQueue.close();
        console.log("Connection closed.");
    }
}

MessageQueueService.processQueue();