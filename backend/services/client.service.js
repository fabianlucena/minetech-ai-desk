import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class ClientService extends ModelService {
  constructor() {
    super({ model: getDependency('clientModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    
    return options;
  }

  async getByName(name) {
    if (!name)
      throw new Error('El nombre es obligatorio');

    return await this.getFirstOrDefault({ where: { name } });
  }

  async create(data, options) {
    if (!data.name)
      throw new Error('El nombre es obligatorio');

    if (!data.code)
      throw new Error('El código es obligatorio');

    if (!data.accessCode)
      throw new Error('El código de acceso es obligatorio');
    
    if (!data.isActive)
      data.isActive = false;

    if (!data.status)
      data.status = 'inactivo';

    return await super.create(data, options);
  }

  async updateByUuid(uuid, data, options) {
    if (!uuid)
      throw new Error('El UUID del cliente es obligatorio');

    const client = await this.getByUuid(uuid);
    if (!client)
      throw new Error('Cliente no encontrado');

    const globalOptions = { session: options?.session };
    return await this.updateById(client.id, data, globalOptions);
  }
}