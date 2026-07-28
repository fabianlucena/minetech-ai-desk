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

  get technicianService() {
    this._technicianService ??= getDependency('technicianService');
    return this._technicianService;
  }

  get conversationService() {
    this._conversationService ??= getDependency('conversationService');
    return this._conversationService;
  }

  get requesterService() {
    this._requesterService ??= getDependency('requesterService');
    return this._requesterService;
  }

  get validPropertiesForCreation() {
    return ['conversationId', 'receivedAt', 'senderType', 'senderId', 'text', 'media', 'receiverType', 'receiverId', 'sentAt'];
  }

  get validPropertiesForUpdate() {
    return ['conversationId', 'receiverType', 'receiverId', 'sentAt'];
  }

  async validateForCreation(data, options) {
    if (!data.conversationId) {
      if (data.conversationUuid) {
        data.conversationId = await this.conversationService.getIdByUuid(data.conversationUuid, { session: options.session });
        delete data.conversationUuid;
      }

      if (!data.conversationId)
        throw new Error('El ID de la conversación es obligatorio');
    } else if (data.conversationUuid)
      delete data.conversationUuid;

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
      const requesters = {};
      const technicians = {};
      if (options.includeSender && options.includeReceiver) {
        for (const message of messages) {
          if (message.senderId) {
            if (message.senderType === 'requester') {
              if (!requesters[message.senderId])
                requesters[message.senderId] = await this.requesterService.getById(message.senderId);

              message.sender = requesters[message.senderId];
            } else if (message.senderType === 'technician') {
              if (!technicians[message.senderId])
                technicians[message.senderId] = await this.technicianService.getById(message.senderId, { includeUser: true });

              message.sender = technicians[message.senderId];
            }
          }

          if (message.receiverId) {
            if (message.receiverType === 'requester') {
              if (!requesters[message.receiverId])
                requesters[message.receiverId] = await this.requesterService.getById(message.receiverId);

              message.receiver = requesters[message.receiverId];
            } else if (message.receiverType === 'technician') {
              if (!technicians[message.receiverId])
                technicians[message.receiverId] = await this.technicianService.getById(message.receiverId, { includeUser: true });

              message.receiver = technicians[message.receiverId];
            }
          }
        }
      } else if (options.includeSender) {
        for (const message of messages) {
          if (message.senderId) {
            if (message.senderType === 'requester') {
              if (!requesters[message.senderId])
                requesters[message.senderId] = await this.requesterService.getById(message.senderId);

              message.sender = requesters[message.senderId];
            } else if (message.senderType === 'technician') {
              if (!technicians[message.senderId])
                technicians[message.senderId] = await this.technicianService.getById(message.senderId, { includeUser: true });

              message.sender = technicians[message.senderId];
            }
          }
        }
      } else if (options.includeReceiver) {
        for (const message of messages) {
          if (message.receiverId) {
            if (message.receiverType === 'requester') {
              if (!requesters[message.receiverId])
                requesters[message.receiverId] = await this.requesterService.getById(message.receiverId);
              
              message.receiver = requesters[message.receiverId];
            } else if (message.receiverType === 'technician') {
              if (!technicians[message.receiverId])
                technicians[message.receiverId] = await this.technicianService.getById(message.receiverId, { includeUser: true });

              message.receiver = technicians[message.receiverId];
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