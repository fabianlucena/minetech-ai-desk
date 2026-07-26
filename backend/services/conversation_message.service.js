import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class ConversationMessageService extends ModelService {
  constructor() {
    super({
      model: getDependency('conversationMessageModel'),
      traceable: false,
      auditable: false,
      useCreatedAt: true,
    });
  }

  get validPropertiesForCreation() {
    return ['conversationId', 'senderType', 'senderId', 'text', 'media', 'receiverType', 'receiverId', 'sentAt'];
  }

  get validPropertiesForUpdate() {
    return ['conversationId', 'senderType', 'senderId', 'text', 'media', 'receiverType', 'receiverId', 'sentAt'];
  }
}