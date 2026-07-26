import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class SettingService extends ModelService {
  constructor() {
    super({ model: getDependency('settingModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);

    return options;
  }

  async getByKey(key, options = {}) {
    if (!key)
      throw new Error('La clave es obligatoria');

    return await this.getFirstOrDefault({ ...options, where: { ...options?.where, key } });
  }

  get validPropertiesForCreation() {
    return ['key', 'value', 'description'];
  }

  get validPropertiesForUpdate() {
    return ['key', 'value', 'description'];
  }

  async validateForCreation(data, options) {
    if (!data.key)
      throw new Error('La clave es obligatoria');

    if (!data.value)
      throw new Error('El valor es obligatorio');

    const existing = await this.getByKey(data.key, { includeDeleted: true });
    if (existing)
      throw new Error('La clave ya está en uso');

    return await super.validateForCreation(data, options);
  }
}