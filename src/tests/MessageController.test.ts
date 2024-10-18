import { Request, Response } from 'express';
import MessageController from '../controllers/messageController.js';
import { MessageQueueService } from '../services/MessageQueue.js';
import CreateMessageRequest from '../shareable/dtos/message/CreateMessageRequest.js';

jest.mock('../services/MessageQueue');

describe('MessageController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock }));

        req = { body: {} };
        res = {
            status: statusMock,
            json: jsonMock,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('should return 400 if the input data is invalid', async () => {
        req.body = {};

        await MessageController.sendMessage(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid input data' });
    });

    it('should send the message successfully and return 201', async () => {
        const validMessage: CreateMessageRequest = { phone: '123456789', message: 'Hello' };
        req.body = validMessage;


        (MessageQueueService.enqueueMessage as jest.Mock).mockResolvedValueOnce(undefined);

        await MessageController.sendMessage(req as Request, res as Response);

        expect(MessageQueueService.enqueueMessage).toHaveBeenCalledWith(validMessage);

        expect(statusMock).toHaveBeenCalledWith(201);
        expect(jsonMock).toHaveBeenCalledWith({ message: 'Message successfully sent' });
    });

    it('should return 500 if there is a failure sending the message', async () => {
        const validMessage: CreateMessageRequest = { phone: '123456789', message: 'Hello' };
        req.body = validMessage;

        (MessageQueueService.enqueueMessage as jest.Mock).mockRejectedValueOnce(new Error('Failed to enqueue message'));

        await MessageController.sendMessage(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Failed to send message' });
    });
});
