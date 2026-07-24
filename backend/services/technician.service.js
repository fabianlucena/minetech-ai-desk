import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';
import { Op } from 'sequelize';

export default class TechnicianService extends ModelService {
  constructor() {
    super({
      allowIdForCreation: true,
      model: getDependency('technicianModel'),
    });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);

    if (options.includeUser) {
      options.include = options.include || [];
      options.include.push({
        model: getDependency('userModel'),
        as: 'user'
      });
      delete options.includeTechnician;
    }
    
    return options;
  }

  getByPhone(phone, options) {
    if (!phone)
      throw new Error('El teléfono es obligatorio');

    return this.getFirstOrDefault({ ...options, where: { ...options?.where, phone } });
  }

  get validPropertiesForCreation() {
    return ['id', 'userId', 'phone', 'isActive', 'color'];
  }

  get validPropertiesForUpdate() {
    return ['phone', 'isActive', 'color'];
  }

  async validateForCreation(data, options) {
    data = { ...data };

    if (!data.id) {
      if (data.userUuid) {
        const userService = getDependency('userService');
        data.id = await userService.getIdByUuid(data.userUuid);
        delete data.userUuid;
      }

      if (!data.id)
        throw new Error('El ID de usuario es obligatorio');
    }

    if (!data.phone)
      throw new Error('El teléfono es obligatorio');

    const existentUser = await this.getById(data.id);
    if (existentUser)
      throw new Error('El usuario ya está configurado como técnico');

    const existentPhone = await this.getByPhone(data.phone);
    if (existentPhone)
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

  async getUsers(options) {
    if (options.skipTechnicians) {
      const technicianModel = getDependency('technicianModel');
      const technicians = await technicianModel.findAll({ attributes: ['id'] });
      const technicianIds = technicians.map(t => t.id);
      options.where = options.where || {};
      options.where.id = { [Op.notIn]: technicianIds };
      delete options.skipTechnicians;
    }

    const userService = getDependency('userService');
    const users = await userService.getList({...options, where: { ...options.where, role: 'technician' }});
    return users;
  }
}