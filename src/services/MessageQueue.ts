import Queue from "bull";
import { MessageProducer } from "./MessageProducer.js";


const messageQueue = new Queue('messageQueue', {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
    }
});

export class MessageQueueService {
    static async enqueueMessage(payload: { phoneNumber: string; messageText: string }) {
        try {
            await messageQueue.add(payload, {
                delay: 5000,
            });
        } catch (error) {
            console.error("Failed to enqueue message:", error);
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
                throw new Error("Failed to send message");
            }
        });
    }
}

MessageQueueService.processQueue();
