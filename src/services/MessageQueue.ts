import Queue from "bull";
import { MessageProducer } from "./MessageProducer.js";
import * as Sentry from "@sentry/node"; 

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
};

const messageQueue = new Queue('messageQueue', { redis: redisConfig });

export class MessageQueueService {
    static validatePayload(payload: { phoneNumber: string; messageText: string }) {
        const { phoneNumber, messageText } = payload;

        if (!phoneNumber || typeof phoneNumber !== 'string') {
            throw new Error(`Invalid phone number: ${phoneNumber}`);
        }

        if (!messageText || typeof messageText !== 'string') {
            throw new Error(`Invalid message text: ${messageText}`);
        }
    }

    static async enqueueMessage(payload: { phoneNumber: string; messageText: string }) {
        try {
            this.validatePayload(payload);
            await messageQueue.add(payload, { delay: 5000 });
        } catch (error) {
            console.error("Failed to enqueue message:", error);
            Sentry.captureException(error);  
            throw error;
        }
    }

    static processQueue() {
        messageQueue.process(async (job) => {
            const { phoneNumber, messageText } = job.data;
            const messageSender = new MessageProducer();

            try {
                await messageSender.send({ phoneNumber, messageText });
                console.log(`Message sent to ${phoneNumber}`);
            } catch (error) {
                console.error("Error sending message:", error);
                Sentry.captureException(error);  
                throw new Error("Failed to send message");
            }
        });
    }
}

MessageQueueService.processQueue();
