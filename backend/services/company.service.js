import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class CompanyService extends ModelService {
  constructor() {
    super({ model: getDependency('companyModel') });
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

    if (!data.clientCode)
      throw new Error('El código de cliente es obligatorio');

    if (!data.token)
      throw new Error('El token es obligatorio');

    if (!data.status)
      data.status = 'inactivo';

    return await super.create(data, options);
  }

  async updateByUuid(uuid, data, options) {
    if (!uuid)
      throw new Error('El UUID del cliente es obligatorio');

    const company = await this.getByUuid(uuid);
    if (!company)
      throw new Error('Cliente no encontrado');

    const globalOptions = { session: options?.session };
    return await this.updateById(company.id, data, globalOptions);
  }
}