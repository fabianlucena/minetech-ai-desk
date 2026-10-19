import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class TicketService extends ModelService {
  constructor() {
    super({ model: getDependency('ticketModel') });
  }

  #clientService;
  get clientService() {
    return this.#clientService ??= getDependency('clientService');
  }

  #clientModel;
  get clientModel() {
    return this.#clientModel ??= getDependency('clientModel');
  }

  #requesterModel;
  get requesterModel() {
    return this.#requesterModel ??= getDependency('requesterModel');
  }

  #technicianModel;
  get technicianModel() {
    return this.#technicianModel ??= getDependency('technicianModel');
  }

  #userModel;
  get userModel() {
    return this.#userModel ??= getDependency('userModel');
  }

  get validPropertiesForCreation() {
    return ['code', 'conversationId', 'clientId', 'requesterId', 'technicianId', 'shiftId', 'status', 'parentTicketId', 'resolvedAt'];
  }

  get validPropertiesForUpdate() {
    return ['code', 'clientId', 'requesterId', 'technicianId', 'shiftId', 'status', 'resolvedAt'];
  }

  async validateForCreation(data, options) {
    if (!data.code) {
      const lastTicket = await this.getFirstOrDefault({
        ...options,
        where: {
          ...options?.where,
          clientId: data.clientId || null,
        },
        order: [['createdAt', 'DESC']]
      });

      data.code = lastTicket ? String((Number.parseInt(lastTicket.code, 10) || 0) + 1) : '1';
    }

    if (!data.status)
      throw new Error('El estado del ticket es obligatorio');

    return await super.validateForCreation(data, options);
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);

    if (options.includeClient) {
      options.include = options.include || [];
      options.include.push({
        model: this.clientModel,
        as: 'client'
      });
      delete options.includeClient;
    }

    if (options.includeRequester) {
      options.include = options.include || [];
      options.include.push({
        model: this.requesterModel,
        as: 'requester'
      });
      delete options.includeRequester;
    }

    if (options.includeTechnician || options.includeTechnicianName) {
      let include;
      if (options.includeTechnicianName) {
        include = [{
          model: this.userModel,
          as: 'user',
        }];
        delete options.includeTechnicianName;
      }

      options.include = options.include || [];
      options.include.push({
        model: this.technicianModel,
        as: 'technician',
        include,
      });

      if (options.includeTechnician)
        delete options.includeTechnician;
    }
    
    return options;
  }

  async getByConversationId(conversationId, options) {
    return await this.getFirstOrDefault({
      ...options,
      where: {
        ...options?.where,
        conversationId
      }
    });
  }

  async getNextCodeForClient(client, options) {
    let code = await this.settingService.getValue('ticketCodeFormat', '{clientCode}-{perClientIncrement}-{YY}');
    
    if (code.includes('{clientCode}'))
      code = code.replace('{clientCode}', client.code);

    if (code.includes('{YY}'))
      code = code.replace('{YY}', new Date().getFullYear().toString().slice(-2));

    const match = /\{(?:(0+)\|)?perClientIncrement\}/.exec(code);
    if (match) {
      const number = client.nextTicketNumber;
      const padding = match[1] || '';
      const paddedNumber = String(number).padStart(padding.length, '0');
      code = code.replace(match[0], paddedNumber);

      this.clientService.updateById(client.id, {
        nextTicketNumber: client.nextTicketNumber + 1
      }, options);
    }

    return code;
  }

  async createFromConversation(conversation, data, options) {
    const ticket = await this.create({
      code: data.code || await this.getNextCodeForClient(conversation.client, options),
      conversationId: conversation.id,
      clientId: conversation.clientId,
      requesterId: conversation.requesterId,
      technicianId: data.technicianId,
      shiftId: data.shiftId,
      status: 'open',
      parentTicketId: data.parentTicketId,
    }, options);

    return ticket;
  }
}