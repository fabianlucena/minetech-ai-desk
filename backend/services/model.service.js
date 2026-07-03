import { getDependency } from '../dependency.js';

export default class ModelService {
  constructor({ model, softDelete = true }) {
    this.model = model;
    this.softDelete = softDelete;
  }

  getModelOptions(options = {}) {
    if (this.softDelete &&!options.includeDeleted)
      options.where = { ...options.where, deletedAt: null };

    if (options.attributes)
      options.attributes = options.attributes;

    return options;
  }

  async getFirstOrDefault(options = {}) {
    options ??= {};
    if (!options.where)
      throw new Error('La cláusula where es obligatoria');

    return this.model.findOne(this.getModelOptions(options));
  }

  async getList(options = {}) {
    options ??= {};
    if (!options.where) {
      options.limit ??= 20;
    }

    return await this.model.findAll(this.getModelOptions(options));
  }

  async getById(id) {
    if (!id)
      throw new Error('ID es obligatorio');

    return this.getFirstOrDefault({ where: { id } });
  }

  async getByIds(ids) {
    if (!ids || !Array.isArray(ids))
      throw new Error('IDs es obligatorio y debe ser un array');

    return await this.getList({ where: { id: ids } });
  }
}