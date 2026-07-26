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