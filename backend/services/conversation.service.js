import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';
import { sendToConversationId } from '../web-sockets/chat.ws.js';

export default class ConversationService extends ModelService {
  constructor() {
    super({
      model: getDependency('conversationModel'),
      traceable: false,
      auditable: false,
      useCreatedAt: true,
    });
  }

  get conversationMessageService() {
    this._conversationMessageService ??= getDependency('conversationMessageService');
    return this._conversationMessageService;
  }

  get requesterService() {
    this._requesterService ??= getDependency('requesterService');
    return this._requesterService;  
  }

  get technicianService() {
    this._technicianService ??= getDependency('technicianService');
    return this._technicianService;
  }

  getModelOptions(options) {
      options = super.getModelOptions(options);
      
      if (options.includeRequester) {
        options.include = options.include || [];
        options.include.push({
          model: getDependency('requesterModel'),
          as: 'requester',
        });
        delete options.includeRequester;
      }

      if (options.includeClient) {
        options.include = options.include || [];
        options.include.push({
          model: getDependency('clientModel'),
          as: 'client',
        });
        delete options.includeClient;
      }
  
      return options;
  }

  async getOpenByRequesterId(requesterId, options = {}) {
    if (!requesterId)
      throw new Error('El ID del solicitante es obligatorio');

    let conversation = await this.getFirstOrDefault({
      ...options,
      includeDeleted: true,
      where: {
        ...options?.where,
        requesterId,
      },
      order: [['createdAt', 'DESC']]
    });

    if (conversation && (conversation.closedAt || conversation.deletedAt))
      conversation = null;

    return conversation;
  }

  async getOpenByRequesterIdOrCreate(requesterId, data,options = {}) {
    const conversation = await this.getOpenByRequesterId(requesterId, options);

    if (!conversation) {
      return await this.create({
        ...data,
        requesterId,
      }, options);
    }

    return conversation;
  }

  get validPropertiesForCreation() {
    return ['requesterId', 'clientId', 'lastMessageAt', 'closedAt', 'closedById'];
  }

  get validPropertiesForUpdate() {
    return ['requesterId', 'clientId', 'lastMessageAt', 'closedAt', 'closedById'];
  }

  async validateForCreation(data, options) {
    if (!data.code) {
      const lastConversation = await this.getFirstOrDefault({
        ...options,
        where: {
          ...options?.where,
          clientId: data.clientId || null,
        },
        order: [['createdAt', 'DESC']]
      });

      data.code = lastConversation ? `${lastConversation.code + 1}` : '1';
    }

    return await super.validateForCreation(data, options);
  }

  async closeById(id, options) {
    const data = {
      closedAt: new Date(),
      closedById: await this.getCurrentUserId(options),
    };

    return await this.updateById(id, data, options);
  }

  async closeByUuid(uuid, options) {
    if (!uuid)
      throw new Error('El UUID de la conversación a cerrar es obligatorio');

    const conversation = await this.getByUuid(uuid, { ...options, includeDeleted: true });
    if (!conversation)
      throw new Error('Conversación a cerrar no encontrado');

    return await this.closeById(conversation.id, options);
  }

  async updateLastMessageById(id, options) {
    const data = {
      lastMessageAt: new Date(),
    };

    return await this.updateById(id, data, options);
  }

  async getMessagesByUuid(uuid, options) {
    if (!uuid)
      throw new Error('El UUID de la conversación es obligatorio');

    const conversationId = await this.getIdByUuid(uuid, options);
    if (!conversationId)
      throw new Error('Conversación a cerrar no encontrada');

    return await this.conversationMessageService.getByConversationId(
      conversationId,
      {
        includeSender: true,
        includeReceiver: true,
        ...options,
      }
    );
  }

  async addMessage(data, options) {
    data = { ...data };

    let conversation;
    if (data.conversation) {
      conversation = data.conversation;

      if (data.conversationId) {
        if (conversation.id !== data.conversationId)
          throw new Error('El ID de la conversación no coincide con el objeto conversación proporcionado');
      } else 
        data.conversationId = conversation.id;

      if (data.conversationUuid) {
        if (conversation.uuid !== data.conversationUuid)
          throw new Error('El UUID de la conversación no coincide con el objeto conversación proporcionado'); 

        delete data.conversationUuid;
      }

      delete data.conversation;
    } else if (data.conversationId) {
      conversation = await this.getById(data.conversationId, options);
      if (!conversation)
        throw new Error('Conversación no encontrada');

      if (data.conversationUuid) {
        if (conversation.uuid !== data.conversationUuid)
          throw new Error('El UUID de la conversación no coincide con el objeto conversación proporcionado');

        delete data.conversationUuid;
      }
      data.conversationId = conversation.id;
    } else if (data.conversationUuid) {
      conversation = await this.getByUuid(data.conversationUuid, options);
      if (!conversation)
        throw new Error('Conversación no encontrada');

      delete data.conversationUuid;
      data.conversationId = conversation.id;
    } else
      throw new Error('El ID de la conversación es obligatorio');

    if (conversation.closedAt)
      throw new Error('Conversación cerrada');

    const message = await this.conversationMessageService.create(data, options);

    await this.updateLastMessageById(conversation.id, options);

    return message;
  }

  async addRequesterMessage(data, options) {
    data = { ...data };

    let requester;
    if (data.requester) {
      requester = data.requester;
      delete data.requester;

      if (data.requesterId) {
        if (requester.id !== data.requesterId)
          throw new Error('El ID del solicitante no coincide con el objeto solicitante proporcionado');

        delete data.requesterId;
      }

      data.senderId = requester.id;
      delete data.requesterId;
    } else if (data.requesterId) {
      requester = await this.requesterService.getById(data.requesterId, options);
      data.senderId = requester.id;
      delete data.requesterId;
    } else
      throw new Error('El solicitante es obligatorio');

    data.senderId = requester.id;

    data.senderType = 'requester';
    const message = await this.addMessage(data, options);

    if (requester.bannedAt) {
      logger.warn(`❌ Ignoring message from banned requester ${requester.phone} (${requester.displayName})`);
      return message;
    }

    // Ejecutar motor RAG
    /* const aiResponse = await ragEngine(text);

    // Decisión automática
    if (aiResponse.confidence >= 0.75) {
      await sendWhatsAppMessage(waId, aiResponse.answer);
      await audit('auto_response', conversation.id, aiResponse);

      return;
    } */

    await this.sendMessageToTechnician(message, options);
    return message;
  }

  async addTechnicianMessage(data, options) {
    data = { ...data };

    let technician;
    if (data.technician) {
      technician = data.technician;
      delete data.technician;

      if (data.technicianId) {
        if (technician.id !== data.technicianId)
          throw new Error('El ID del técnico no coincide con el objeto técnico proporcionado');

        delete data.technicianId;
      }

      data.senderId = technician.id;
      delete data.technicianId;
    } else if (data.technicianId) {
      technician = await this.technicianService.getById(data.technicianId, options);
      data.senderId = technician.id;
      delete data.technicianId;
    } else
      throw new Error('El técnico es obligatorio');

    data.senderId = technician.id;

    data.senderType = 'technician';
    const message = await this.addMessage(data, options);

    await this.sendMessageToRequester(message, options);
    return message;
  }

  async sendMessageToTechnician(message, options) {
    const technician = await this.technicianService.getOnDuty();
    if (!technician) {
      logger.error('There is no on-duty technician to handle the incoming message');
      return;
    }
    
    await this.technicianService.sendMessageById(technician.id, {
      text: message.text,
      media: message.media,
    });

    await sendToConversationId(message.conversationId, {
      text: message.text,
      media: message.media,
    });

    await this.conversationMessageService.updateById(message.id, {
      receiverId: technician.id,
      receiverType: 'technician',
      sentAt: new Date(),
    }, options);
  }

  async sendMessageToRequester(message, options) {
    const conversation = await this.getById(message.conversationId, { ...options });
    if (!conversation) {
      logger.error('Conversation not found');
      return;
    }

    if (!conversation.requesterId) {
      logger.error('Conversation has no requesterId');
      return;
    }

    if (conversation.closedAt) {
      logger.error('Conversation is closed');
      return;
    }

    const requesterId = conversation.requesterId;

    await this.requesterService.sendMessageById(requesterId, {
      text: message.text,
      media: message.media,
    });

    await sendToConversationId(message.conversationId, {
      text: message.text,
      media: message.media,
    });

    await this.conversationMessageService.updateById(message.id, {
      receiverId: requesterId,
      receiverType: 'requester',
      sentAt: new Date(),
    }, options);
  }
}