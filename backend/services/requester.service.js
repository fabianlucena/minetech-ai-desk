import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class RequesterService extends ModelService {
  constructor() {
    super({ model: getDependency('requesterModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    
    return options;
  }

  get validPropertiesForCreation() {
    return ['clientId', 'displayName', 'phone', 'email', 'isActive', 'type'];
  }

  get validPropertiesForUpdate() {
    return ['clientId', 'displayName', 'phone', 'email', 'isActive', 'type'];
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
          isActive: true,
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

    if (!data.isActive)
      data.isActive = false;

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
}