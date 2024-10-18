import { PrismaClient, Message } from '@prisma/client';
import CreateMessageRequest from '../../shareable/dtos/message/CreateMessageRequest.js';
import { MessageResponse } from '../../shareable/dtos/message/MessageResponse.js';

export class MessageRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createMessage(data: CreateMessageRequest): Promise<MessageResponse> {
    const message = await this.prisma.message.create({
      data: {
        phoneNumber: data.phoneNumber,
        messageText: data.messageText,
      },
    });
    
    return this.toResponseDTO(message);
  }

  async getMessageById(id: string): Promise<MessageResponse | null> {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });
    
    return message ? this.toResponseDTO(message) : null;
  }

  async getAllMessages(): Promise<MessageResponse[]> {
    const messages = await this.prisma.message.findMany();
    return messages.map(this.toResponseDTO);
  }

  async updateMessage(id: string, data: Partial<CreateMessageRequest>): Promise<MessageResponse | null> {
    const message = await this.prisma.message.update({
      where: { id },
      data: {
        phoneNumber: data.phoneNumber,
        messageText: data.messageText,
      },
    });
    
    return this.toResponseDTO(message);
  }

  async deleteMessage(id: string): Promise<MessageResponse | null> {
    const message = await this.prisma.message.delete({
      where: { id },
    });
    
    return this.toResponseDTO(message);
  }

  private toResponseDTO(message: Message): MessageResponse {
    return {
      id: message.id,
      phoneNumber: message.phoneNumber,
      messageText: message.messageText,
      createdAt: message.createdAt,
    };
  }
}
