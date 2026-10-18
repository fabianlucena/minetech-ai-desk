import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';
import { timePeriod2Milliseconds } from '../utils/time.js';

export default class SettingService extends ModelService {
  #cache = {};
  #timePeriodMillisecondsCache = {};

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

    const existing = await this.getByKey(data.key, { includeDeleted: true });
    if (existing)
      throw new Error('La clave ya está en uso');

    return await super.validateForCreation(data, options);
  }

  async validateForUpdate(data, options) {
    const ids = await this.getIdList(options);

    if (!ids.length)
      throw new Error('Elemento no encontrado');

    if ('key' in data) {
      if (!data.key)
        throw new Error('La clave es obligatoria');

      if (ids.length > 1)
        throw new Error('No se puede colocar la misma clave a varias configuraciones');

      const existing = await this.getByKey(data.key, { includeDeleted: true });
      if (existing && existing.id !== ids[0])
        throw new Error('La clave ya está en uso');
    }

    return await super.validateForUpdate(data, options);
  }

  async update(data, options = {}) {
    this.#cache = {};
    this.#timePeriodMillisecondsCache = {};
    return await super.update(data, options);
  }

  async delete(options = {}) {
    this.#cache = {};
    this.#timePeriodMillisecondsCache = {};
    return await super.delete(options);
  }

  async getValue(key, defaultValue, options = {}) {
    if (!key)
      throw new Error('La clave es obligatoria');

    if (key in this.#cache)
      return this.#cache[key];

    const setting = await this.getByKey(key, options);
    const value = setting ? setting.value : defaultValue;

    this.#cache[key] = value;

    return value;
  }

  async getValueTimePeriodMilliseconds(key, defaultValue, options = {}) {
    if (!key)
      throw new Error('La clave es obligatoria');

    if (key in this.#timePeriodMillisecondsCache)
      return this.#timePeriodMillisecondsCache[key];

    const strValue = await this.getValue(key, defaultValue, options);
    let value = timePeriod2Milliseconds(strValue.trim());
    if (!value)
      value = timePeriod2Milliseconds(defaultValue);

    this.#timePeriodMillisecondsCache[key] = value;

    return value;
  }
}