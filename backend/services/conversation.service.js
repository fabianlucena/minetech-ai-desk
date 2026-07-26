import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class ConversationService extends ModelService {
  constructor() {
    super({ model: getDependency('conversationModel') });
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

    return this.getFirstOrDefault({
      ...options,
      where: {
        ...options?.where,
        requesterId,
      },
      order: [['createdAt', 'DESC']]
    });
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
    return ['code', 'clientId', 'requesterId', 'technicianId', 'shiftId', 'resolvedAt'];
  }

  get validPropertiesForUpdate() {
    return ['code', 'clientId', 'requesterId', 'technicianId', 'shiftId', 'resolvedAt'];
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

    /*if (!data.status)
      throw new Error('El estado del conversation es obligatorio');*/

    return await super.validateForCreation(data, options);
  }
}