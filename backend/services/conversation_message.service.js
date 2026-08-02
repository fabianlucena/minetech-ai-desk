import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';
import { sendMessageToConversationId } from '../web-sockets/chat.ws.js';

export default class ConversationMessageService extends ModelService {
  constructor() {
    super({
      model: getDependency('conversationMessageModel'),
      useCreatedById: false,
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
    return ['conversationId', 'text', 'media', 'externalMessageId',
      'senderType', 'senderId', 'receiverType', 'receiverId', 
      'receivedAt', 'sentAt', 'deliveredAt', 'readAt', 'failedAt', 'failureReason',
    ];
  }

  get validPropertiesForUpdate() {
    return ['conversationId', 'externalMessageId',
      'receiverType', 'receiverId',
      'receivedAt', 'sentAt', 'deliveredAt', 'readAt', 'failedAt', 'failureReason',
    ];
  }
  
  async validateConversation(data, options) {
    data = { ...data };

    if (!data.conversationId) {
      if (data.conversationUuid) {
        data.conversationId = await this.conversationService.getIdByUuid(data.conversationUuid, { session: options.session });
        delete data.conversationUuid;
      }

      if (data.conversation) {
        data.conversationId = data.conversation.id;
        delete data.conversation;
      }
    }

    if (data.conversation) {
      if (data.conversation.id !== data.conversationId)
        throw new Error('El ID de la conversación no coincide con la conversación proporcionada');

      if (data.conversationUuid) {
        if (data.conversationUuid !== data.conversation.uuid)
          throw new Error('El UUID de la conversación no coincide con la conversación proporcionada');

        delete data.conversationUuid;
      }

      delete data.conversation;
    } else if (data.conversationUuid) {
      const conversationUuid = await this.conversationService.getUuidById(data.conversationId, { session: options.session });
      if (conversationUuid !== data.conversationUuid)
        throw new Error('El UUID de la conversación no coincide con el ID de la conversación proporcionado');

      delete data.conversationUuid;
    }

    return data;
  }

  async validateReceiver(data, options) {
    if (data.receiverType === 'requester') {
      const requester = await this.requesterService.getById(data.receiverId, { session: options.session });
      if (!requester)
        throw new Error('El destinatario no es un cliente válido');
    } else if (data.receiverType === 'technician') {
      const technician = await this.technicianService.getById(data.receiverId, { session: options.session });
      if (!technician)
        throw new Error('El destinatario no es un técnico válido');
    } else if (data.receiverType === 'system') {
      if (data.receiverId)
        throw new Error('El destinatario "Sistema" no puede tener ID');
    } else if (data.receiverType){
      throw new Error('El tipo de destinatario no es válido');
    }

    if (data.receiverId && !data.receiverType) {
      throw new Error('El tipo de destinatario es obligatorio si se especifica el ID del destinatario');
    }

    if (data.sentAt || data.deliveredAt || data.readAt) {
      if (!data.receiverType) {
        if (!options?.where)
          throw new Error('El tipo y el ID del destinatario son obligatorios si se especifica alguna fecha de estado');
        
        const list = await this.getList(options);
        if (!list.length)
          throw new Error('El tipo y el ID del destinatario son obligatorios si se especifica alguna fecha de estado');

        for (const message of list) {
          if (!message.receiverType)
            throw new Error('El tipo y el ID del destinatario son obligatorios si se especifica alguna fecha de estado');
        }
      }
    }

    return data;
  }

  async validateForCreation(data, options) {
    data = await this.validateConversation(data, options);

    if (!data.conversationId)
      throw new Error('El ID de la conversación es obligatorio');

    if (!data.text && !data.media)
      throw new Error('El texto o el medio son obligatorios');

    if (!data.senderType)
      throw new Error('El tipo de remitente es obligatorio');

    if (!data.senderId && data.senderType !== 'system')
      throw new Error('El ID del remitente es obligatorio');

    if (data.senderType === 'requester') {
      const requester = await this.requesterService.getById(data.senderId, { session: options.session });
      if (!requester)
        throw new Error('El remitente no es un cliente válido');
    } else if (data.senderType === 'technician') {
      const technician = await this.technicianService.getById(data.senderId, { session: options.session });
      if (!technician)
        throw new Error('El remitente no es un técnico válido');
    } else if (data.senderType === 'system') {
      if (data.senderId)
        throw new Error('El remitente "Sistema" no puede tener ID');
    } else if (data.senderType) {
      throw new Error('El tipo de remitente no es válido');
    } else
      throw new Error('El tipo de remitente es obligatorio');

    data = await this.validateReceiver(data, options);

    data.receivedAt ??= new Date();

    return await super.validateForCreation(data, options);
  }

  async validateForUpdate(data, options) {
    data = await this.validateConversation(data, options);
    data = await this.validateReceiver(data, options);

    return await super.validateForUpdate(data, options);
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

  async getByExternalMessageId(externalMessageId, options) {
    if (!externalMessageId)
      throw new Error('El ID externo del mensaje es obligatorio');

    if (Array.isArray(externalMessageId)) {
      const rows = await this.getList({ ...options, where: { ...options?.where, externalMessageId } });
      return rows;
    } else {
      const row = await this.getFirstOrDefault({ ...options, where: { ...options?.where, externalMessageId } });
      return row;
    }
  }

  async updateStatus(message, status, options) {
    await this.updateById(message.id, status, options);
    await sendMessageToConversationId(
      message.conversationId,
      {
        uuid: message.uuid,
        ...status,
      },
      options
    );
  }
}