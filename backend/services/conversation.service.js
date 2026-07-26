import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class ConversationService extends ModelService {
  constructor() {
    super({
      model: getDependency('conversationModel'),
      traceable: false,
      auditable: false,
      useCreatedAt: true,
    });
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
    return ['code', 'clientId', 'requesterId', 'clientId', 'lastMessageAt', 'closedAt', 'closedById'];
  }

  get validPropertiesForUpdate() {
    return ['code', 'clientId', 'requesterId', 'clientId', 'lastMessageAt', 'closedAt', 'closedById'];
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
      throw new Error('El UUID de la conversacion es obligatorio');

    const conversationId = await this.getIdByUuid(uuid, options);
    if (!conversationId)
      throw new Error('Conversación a cerrar no encontrado');

    const conversationMessageService = getDependency('conversationMessageService');
    return await conversationMessageService.getByConversationId(
      conversationId,
      options,
    );
  }
}