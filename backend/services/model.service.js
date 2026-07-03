import { getDependency } from '../dependency.js';

export default class ModelService {
  constructor({ model, softDelete = true }) {
    this.model = model;
    this.softDelete = softDelete;
  }

  async create(data, options = {}) {
    if (!data || typeof data !== 'object')
      throw new Error('Data es obligatorio y debe ser un objeto');

    const result = await this.model.create(data, options);
    return result.get({ plain: true });
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

    const result = await this.model.findOne(this.getModelOptions(options));
    return result?.get({ plain: true }) || null;
  }

  async getList(options = {}) {
    options ??= {};
    if (!options.where) {
      options.limit ??= 20;
    }

    const result = await this.model.findAll(this.getModelOptions(options));
    return result.map(r => r.get({ plain: true }));
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

  async update(data, options = {}) {
    if (!data || typeof data !== 'object')
      throw new Error('Data es obligatorio y debe ser un objeto');

    const result = await this.model.update(data, options);

    return result;
  }

  async updateById(id, data) {
    if (!id)
      throw new Error('ID es obligatorio');

    const [updatedCount] = await this.update(data, { where: { id } });
    if (updatedCount === 0)
      throw new Error(`No se encontró el registro con ID ${id}`);

    return await this.getById(id);
  }
}