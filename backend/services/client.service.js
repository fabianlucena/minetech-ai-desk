import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';
import { Op } from 'sequelize';

export default class ClientService extends ModelService {
  constructor() {
    super({ model: getDependency('clientModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    
    return options;
  }

  async getByName(name, options) {
    if (!name)
      throw new Error('El nombre es obligatorio');

    return await this.getFirstOrDefault({ ...options, where: { name } });
  }

  async getByCode(code, options) {
    if (!code)
      throw new Error('El código es obligatorio');

    return await this.getFirstOrDefault({ ...options, where: { code } });
  }

  async getByAccessCode(accessCode, options) {
    if (!accessCode)
      throw new Error('El código de acceso es obligatorio');

    return await this.getFirstOrDefault({ ...options, where: { accessCode } });
  }

  async getByName(name, options) {
    if (!name)
      throw new Error('El nombre es obligatorio');

    return await this.getFirstOrDefault({ ...options, where: { name } });
  }

  get validPropertiesForCreation() {
    return ['name', 'code', 'accessCode', 'isActive', 'status'];
  }

  async validateForCreation(data, options) {
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

    let existent = await this.getByName(data.name, { includeDeleted: true });
    if (existent)
      return 'El nombre del cliente ya existe';

    existent = await this.getByCode(data.code, { includeDeleted: true });
    if (existent)
      return 'El código del cliente ya existe';

    existent = await this.getByAccessCode(data.accessCode, { includeDeleted: true });
    if (existent)
      return 'El código de acceso del cliente ya existe';

    return await super.validateForCreation(data, options);
  }

  get validPropertiesForUpdate() {
    return ['name', 'code', 'accessCode', 'isActive', 'status'];
  }

  async validateForUpdate(data, options) {
    const ids = await this.getIdList(options);

    if (!ids.length)
      throw new Error('No se encontraron clientes con los criterios especificados');

    if (ids.length > 1) {
      if (data.name)
        throw new Error('No se pueden colocar el mismo nombre a varios clientes');

      if (data.code)
        throw new Error('No se puede colocar el mismo código a varios clientes');

      if (data.accessCode)
        throw new Error('No se puede colocar el mismo código de acceso a varios clientes');
    } else {
      if (data.name) {
        const existent = await this.getByName(data.name, { includeDeleted: true, where: { id: { [Op.ne]: ids[0] } } });
        if (existent && existent.id !== ids[0])
          throw new Error('El nombre del cliente ya existe');
      }

      if (data.code) {
        const existent = await this.getByCode(data.code, { includeDeleted: true, where: { id: { [Op.ne]: ids[0] } } });
        if (existent && existent.id !== ids[0])
          throw new Error('El código del cliente ya existe');
      }

      if (data.accessCode) {
        const existent = await this.getByAccessCode(data.accessCode, { includeDeleted: true, where: { id: { [Op.ne]: ids[0] } } });
        if (existent && existent.id !== ids[0])
          throw new Error('El código de acceso del cliente ya existe');
      }
    }

    return await super.validateForUpdate(data, options);
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