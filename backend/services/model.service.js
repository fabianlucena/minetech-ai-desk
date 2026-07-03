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

  async getFirstOrDefault(where, options = {}) {
    if (!where)
      throw new Error('La cláusula where es obligatoria');

    return this.model.findOne(this.getModelOptions({ where, ...options }));
  }

  async getList(where, options = {}) {
    if (!where) {
      options.limit ??= 20;
    }

    return await this.model.findAll(this.getModelOptions({ where, ...options }));
  }

  async getById(id) {
    if (!id)
      throw new Error('ID es obligatorio');

    return this.getFirstOrDefault({ id });
  }

  async getByIds(ids) {
    if (!ids || !Array.isArray(ids))
      throw new Error('IDs es obligatorio y debe ser un array');

    return await this.getList({ id: ids }, { raw: true });
  }
}