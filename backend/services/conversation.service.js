import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';
import { sendMessageToConversationId } from '../web-sockets/chat.ws.js';
import { ConversationMessageDTO } from '../dto/conversation_message.dto.js';

const logger = getDependency('logger');

export default class ConversationService extends ModelService {
  constructor() {
    super({
      model: getDependency('conversationModel'),
      traceable: false,
      auditable: false,
      useCreatedAt: true,
    });
  }

  #conversationMessageService;
  get conversationMessageService() {
    return this.#conversationMessageService ??= getDependency('conversationMessageService');
  }

  #requesterService;
  get requesterService() {
    return this.#requesterService ??= getDependency('requesterService');
  }

  #technicianService;
  get technicianService() {
    return this.#technicianService ??= getDependency('technicianService');
  }

  #ticketService;
  get ticketService() {
    return this.#ticketService ??= getDependency('ticketService');
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

  async getOpenByRequesterIdOrCreate(requesterId, data, options = {}) {
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
    const message = await this.addMessage(
      data,
      {
        ...options,
        includeConversation: true,
        includeClient: true,
      },
    );

    if (requester.bannedAt) {
      logger.warn(`❌ Ignoring message from banned requester ${requester.phone} (${requester.displayName})`);
      return message;
    }

    message.sender = requester;

    const isMessage = await this.requesterService.checkState(message, options);
    options.notify = isMessage;

    const technician = await this.technicianService.getOnDuty();
    if (!technician) {
      logger.error('There is no on-duty technician to handle the incoming message');
      return;
    }
    message.receiver = technician;

    if (isMessage) {
      let ticket = await this.ticketService.getByConversationId(message.conversationId, options);
      if (!ticket) {
        ticket = await this.ticketService.createFromConversation(
          message.conversation,
          { technicianId: technician.id }
        );
      } else if (ticket.technicianId !== technician.id) {
        await this.ticketService.updateById(ticket.id, { technicianId: technician.id }, options);
      }
    }

    // Ejecutar motor RAG
    /* const aiResponse = await ragEngine(text);

    // Decisión automática
    if (aiResponse.confidence >= 0.75) {
      await sendWhatsAppMessage(waId, aiResponse.answer);
      await audit('auto_response', conversation.id, aiResponse);

      return;
    } */

    await this.sendMessageToTechnician(
      message,
      options,
    );

    return message;
  }

  async addUserMessage(data, options) {
    data = { ...data };

    let user;
    if (data.user) {
      user = data.user;
      delete data.user;

      if (data.userId) {
        if (user.id !== data.userId)
          throw new Error('El ID del usuario no coincide con el objeto usuario proporcionado');

        delete data.userId;
      }

      data.senderId = user.id;
      delete data.userId;
    } else if (data.userId) {
      user = await this.userService.getById(data.userId, options);
      data.senderId = user.id;
      delete data.userId;
    } else
      throw new Error('El usuario es obligatorio');

    data.senderId = user.id;
    data.senderType = 'user';
    const message = await this.addMessage(data, options);

    message.sender = user;

    await this.sendMessageToRequester(
      message,
      options
    );

    return message;
  }

  async addSystemMessage(data, options) {
    data = { ...data };

    data.senderId = null;
    data.senderType = 'system';
    const message = await this.addMessage(data, options);

    await this.sendMessageToRequester(
      message,
      options
    );

    return message;
  }

  async replyMessageBySystem(message, replyTo, options) {
    if (typeof message === 'string') {
      message = { text: message };
    } else {
      message = { ...message };
    }

    message.conversationId = replyTo.conversationId;
    message.replyToId = replyTo.id;

    return await this.addSystemMessage(message, options);
  }

  async sendMessageToTechnician(message, options) {
    let conversation = message.conversation;
    if (!conversation) {
      conversation = await this.getById(message.conversationId, { ...options });
      message.conversation = conversation;
    }

    if (!conversation) {
      logger.error('Conversation not found');
      return;
    }

    message.receiver = technician;
    if (message.receiverId !== technician.id || message.receiverType !== 'user') {
      message.receiverId = technician.id;
      message.receiverType = 'user';
      await this.conversationMessageService.updateById(
        message.id,
        {
          receiverId: technician.id,
          receiverType: 'user',
        },
        options
      );
    }

    const messageToSend = new ConversationMessageDTO(message);

    await sendMessageToConversationId(
      message.conversationId,
      messageToSend,
    );

    if (options.notify !== false) {
      let status;
      try {
        await this.technicianService.sendMessageById(
          technician.id,
          messageToSend,
          options,
        );

        status = { sentAt: new Date() };
      } catch (error) {
        status = { failedAt: new Date(), failureReason: error.message };
        logger.error('Error sending message to technician', error);
      }

      await this.conversationMessageService.updateStatus(message, status, options);
    }
  }

  async sendMessageToRequester(message, options) {
    let conversation = message.conversation;
    if (!conversation) {
      conversation = await this.getById(message.conversationId, { ...options });
      message.conversation = conversation;
    }

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
    if (message.receiverId !== requesterId || message.receiverType !== 'requester') {
      message.receiverId = requesterId;
      message.receiverType = 'requester';
      await this.conversationMessageService.updateById(
        message.id,
        {
          receiverId: requesterId,
          receiverType: 'requester',
        },
        options
      );
    }

    if (!message.receiver) {
      message.receiver = await this.requesterService.getById(requesterId, options);
      if (!message.receiver) {
        logger.error('Requester not found');
        return;
      }
    }

    if (!message.receiver.phone) {
      logger.error('Requester has no phone number');
      return;
    }

    const messageToSend = new ConversationMessageDTO(message);

    await sendMessageToConversationId(
      message.conversationId,
      messageToSend,
      options
    );

    await this.conversationMessageService.updateStatus(message, { sentAt: new Date() }, options);

    try {
      await this.requesterService.sendMessageById(
        requesterId,
        message,
        options
      );
    } catch (error) {
      await this.conversationMessageService.updateStatus(
        message,
        { failedAt: new Date(), failureReason: error.message },
        options
      );
      logger.error('Error sending message to requester', error);
    }
  }
}