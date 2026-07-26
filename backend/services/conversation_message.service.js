import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class ConversationMessageService extends ModelService {
  constructor() {
    super({
      model: getDependency('conversationMessageModel'),
      traceable: false,
      auditable: false,
    });
  }

  get validPropertiesForCreation() {
    return ['conversationId', 'receivedAt', 'senderType', 'senderId', 'text', 'media', 'receiverType', 'receiverId', 'sentAt'];
  }

  get validPropertiesForUpdate() {
    return ['conversationId', 'receiverType', 'receiverId', 'sentAt'];
  }

  async validateForCreation(data, options) {
    if (!data.senderType)
      throw new Error('El tipo de remitente es obligatorio');

    if (!data.senderId)
      throw new Error('El ID del remitente es obligatorio');

    if (!data.text && !data.media)
      throw new Error('El texto o el medio son obligatorios');
    
    data.receivedAt = new Date();

    return await super.validateForCreation(data, options);
  }

  async getList(options) {
    const messages = await super.getList(options);
    if (options.includeSender || options.includeReceiver) {
      const requesterService = getDependency('requesterService');
      const technicianService = getDependency('technicianService');

      if (options.includeSender && options.includeReceiver) {
        for (const message of messages) {
          if (message.senderId) {
            if (message.senderType === 'requester') {
              message.sender = await requesterService.getById(message.senderId);
            } else if (message.senderType === 'technician') {
              message.sender = await technicianService.getById(message.senderId, { includeUser: true });
            }
          }

          if (message.receiverId) {
            if (message.receiverType === 'requester') {
              message.receiver = await requesterService.getById(message.receiverId);
            } else if (message.receiverType === 'technician') {
              message.receiver = await technicianService.getById(message.receiverId, { includeUser: true });
            }
          }
        }
      } else if (options.includeSender) {
        for (const message of messages) {
          if (message.senderId) {
            if (message.senderType === 'requester') {
              message.sender = await requesterService.getById(message.senderId);
            } else if (message.senderType === 'technician') {
              message.sender = await technicianService.getById(message.senderId, { includeUser: true });
            }
          }
        }
      } else if (options.includeReceiver) {
        for (const message of messages) {
          if (message.receiverId) {
            if (message.receiverType === 'requester') {
              message.receiver = await requesterService.getById(message.receiverId);
            } else if (message.receiverType === 'technician') {
              message.receiver = await technicianService.getById(message.receiverId, { includeUser: true });
            }
          }
        }
      }
    }

    return messages;
  }

  async getByConversationId(conversationId, options) {
    if (!conversationId)
      throw new Error('El ID de la conversación es obligatorio');

    return await this.getList({
      ...options,
      where: {
        ...options?.where,
        conversationId,
      },
    });
  }
}