import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class OperatorService extends ModelService {
  constructor() {
    super({ model: getDependency('operatorModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    
    return options;
  }

  async getByName(fullName) {
    if (!fullName)
      throw new Error('El nombre completo es obligatorio');

    return await this.getFirstOrDefault({ where: { fullName } });
  }

  async create(data, options) {
    if (!data.fullName)
      throw new Error('El nombre completo es obligatorio');

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