import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class RequesterService extends ModelService {
  constructor() {
    super({ model: getDependency('requesterModel') });
  }

  get whatsappService() {
    this._whatsappService ??= getDependency('whatsappService');
    return this._whatsappService;
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);

    if (options.includeClient) {
      options.include = options.include || [];
      options.include.push({
        model: getDependency('clientModel'),
        as: 'client'
      });
      delete options.includeClient;
    }
    
    return options;
  }

  get validPropertiesForCreation() {
    return ['clientId', 'displayName', 'phone', 'email', 'type', 'bannedAt', 'bannedById', 'banReason'];
  }

  get validPropertiesForUpdate() {
    return ['clientId', 'displayName', 'phone', 'email', 'type', 'bannedAt', 'bannedById', 'banReason'];
  }

  async getByDisplayName(displayName) {
    if (!displayName)
      throw new Error('El nombre es obligatorio');

    return await this.getFirstOrDefault({ where: { displayName } });
  }

  async getByPhone(phone, options) {
    if (!phone)
      throw new Error('El teléfono es obligatorio');

    return await this.getFirstOrDefault({ ...options, where: { ...options?.where, phone } });
  }

  async getByPhoneOrCreate(phone, data, options) {
    if (!phone)
      throw new Error('El teléfono es obligatorio');

    let requester = await this.getByPhone(phone, options);
    if (!requester) {
      if (typeof data === 'function') {
        data = data();
      }
      
      requester = await this.create(
        {
          type: 'customer',
          ...data,
          phone,
        },
        options
      );
    }

    return requester;
  }

  async create(data, options) {
    if (!data.displayName)
      throw new Error('El nombre es obligatorio');

    if (!data.phone)
      throw new Error('El teléfono es obligatorio');

    return await super.create(data, options);
  }

  async updateByUuid(uuid, data, options) {
    if (!uuid)
      throw new Error('El UUID del solicitante es obligatorio');

    const requester = await this.getByUuid(uuid);
    if (!requester)
      throw new Error('Solicitante no encontrado');

    const globalOptions = { session: options?.session };
    return await this.updateById(requester.id, data, globalOptions);
  }

  async banByUuid(uuid, data, options) {
    const banReason = data?.banReason?.trim();
    if (!banReason)
      throw new Error('El motivo del baneo es obligatorio');

    return await this.updateByUuid(uuid, {
      banReason,
      bannedAt: new Date(),
      bannedById: await this.getCurrentUserId(options),
    }, options);
  }

  async unbanByUuid(uuid, options) {
    return await this.updateByUuid(uuid, {
      banReason: null,
      bannedAt: null,
      bannedById: null,
    }, options);
  }

  async sendMessageById(requesterId, message, options) {
    const requester = await this.getById(requesterId, options);
    if (!requester)
      throw new Error('Solicitante no encontrado');

    return await this.sendMessage(requester, message);
  }

  async sendMessage(requester, message) {
    return await this.whatsappService.sendMessage({ to: requester.phone, body });
  }
}