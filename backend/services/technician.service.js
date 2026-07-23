import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';
import { Op } from 'sequelize';

export default class TechnicianService extends ModelService {
  constructor() {
    super({ model: getDependency('technicianModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    
    return options;
  }

  getByPhone(phone, options) {
    if (!phone)
      throw new Error('El teléfono es obligatorio');

    return this.getFirstOrDefault({ ...options, where: { ...options?.where, phone } });
  }

  get validPropertiesForCreation() {
    return ['fullName', 'phone', 'isActive', 'color'];
  }

  get validPropertiesForUpdate() {
    return ['fullName', 'phone', 'isActive', 'color'];
  }

  async validateForCreation(data, options) {
    if (!data.fullName)
      throw new Error('El nombre completo es obligatorio');

    if (!data.phone)
      throw new Error('El teléfono es obligatorio');

    const existent = await this.getByPhone(data.phone);
    if (existent)
      throw new Error('El teléfono del técnico ya existe');

    return await super.validateForCreation(data, options);
  }

  async validateForUpdate(data, options) {
    if (data.phone) {
      const ids = await this.getIdList({ where: options.where, includeDeleted: true });
      if (!ids?.length)
        throw new Error('No se encontraron técnicos para actualizar');

      if (ids.length > 1)
        throw new Error('Se encontraron múltiples técnicos para actualizar, debe especificar un técnico único');

      const existent = await this.getByPhone(data.phone, { where: { id: { [Op.ne]: ids } } });
      if (existent)
        throw new Error('El teléfono del técnico ya está en uso');
    }

    return await super.validateForUpdate(data, options);
  }

  async getByFullName(fullName) {
    if (!fullName)
      throw new Error('El nombre completo es obligatorio');

    return await this.getFirstOrDefault({ where: { fullName } });
  }

  async updateByUuid(uuid, data, options) {
    if (!uuid)
      throw new Error('El UUID del técnico es obligatorio');

    const technician = await this.getByUuid(uuid);
    if (!technician)
      throw new Error('Técnico no encontrado');

    const globalOptions = { session: options?.session };
    return await this.updateById(technician.id, data, globalOptions);
  }

  async getUsers(options) {
    const userService = getDependency('userService');
    const users = await userService.getList({ where: { role: 'technician' }, ...options });
    return users;
  }
}