import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class TechnicianService extends ModelService {
  constructor() {
    super({ model: getDependency('technicianModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    
    return options;
  }

  async getByFullName(fullName) {
    if (!fullName)
      throw new Error('El nombre completo es obligatorio');

    return await this.getFirstOrDefault({ where: { fullName } });
  }

  async create(data, options) {
    if (!data.fullName)
      throw new Error('El nombre completo es obligatorio');

    if (!data.phone)
      throw new Error('El teléfono es obligatorio');

    return await super.create(data, options);
  }

  async updateByUuid(uuid, data, options) {
    if (!uuid)
      throw new Error('El UUID del técnico es obligatorio');

    const technician = await this.getByUuid(uuid);
    if (!technician)
      throw new Error('Técnico no encontrado');

    return await this.updateById(technician.id, data, globalOptions);
  }
}