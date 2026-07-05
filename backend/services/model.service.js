import { getDependency } from '../dependency.js';

export default class ModelService {
  constructor({
    model,
    traceable = true,
    auditable = true,
    softDelete = true,
  }) {
    this.model = model;
    this.traceable = true;
    this.auditable = true;
    this.softDelete = softDelete;
  }

  async getSystemUserId() {
    if (!this.systemUserId) {
      const userService = getDependency('userService');
      const systemUser = await userService.getFirstOrDefault({
        attributes: ['id'],
        where: { username: 'system' },
      });

      if (!systemUser)
        throw new Error('Usuario system no encontrado');

      this.systemUserId = systemUser.id;
    }

    return this.systemUserId;
  }

  async getCurrentUserId(options) {
    if (!this.currentUserId) {
      this.currentUserId =
        options?.currentUserId || 
        options?.session?.userId || 
        options?.session?.user?.id ||
        await this.getSystemUserId();
    }

    return this.currentUserId;
  }

  getModelOptions(options) {
    options = { ...options };
    if (this.softDelete && !options.includeDeleted)
      options.where = { ...options.where, deletedAt: null };

    if (options.attributes)
      options.attributes = options.attributes;

    return options;
  }

  async create(data, options = {}) {
    if (!data || typeof data !== 'object')
      throw new Error('Data es obligatorio y debe ser un objeto');

    if (this.traceable) {
      data.createdAt ??= new Date();
      data.createdById ??= await this.getCurrentUserId(options);
    }

    if (this.auditable) {
      data.updatedAt ??= new Date();
      data.updatedById ??= await this.getCurrentUserId(options);
    }

    const result = await this.model.create(data, options);
    return result.get({ plain: true });
  }

  async bulkCreate(dataList, options) {
    if (!Array.isArray(dataList))
      throw new Error('DataList es obligatorio y debe ser un arreglo');

    if (this.traceable) {
      const date = new Date();
      const creatorId = await this.getCurrentUserId(options);
      dataList = dataList.map(data => {
        data.createdAt ??= date;
        data.createdById ??= creatorId;
        return data;
      });
    }

    if (this.auditable) {
      const date = new Date();
      const updaterId = await this.getCurrentUserId(options);
      dataList = dataList.map(data => {
        data.updatedAt ??= date;
        data.updatedById ??= updaterId;
        return data;
      });
    }
  
    return await this.model.bulkCreate(dataList, options);
  }

  async getFirstOrDefault(options) {
    if (!options?.where)
      throw new Error('La cláusula where es obligatoria');

    const result = await this.model.findOne(this.getModelOptions(options));
    return result?.get({ plain: true }) || null;
  }

  async getList(options) {
    if (!options.where) {
      options = {...options};
      options.limit ??= 20;
    }

    const result = await this.model.findAll(this.getModelOptions(options));
    return result.map(r => r.get({ plain: true }));
  }

  async getById(id, options) {
    if (!id)
      throw new Error('ID es obligatorio');

    return this.getFirstOrDefault({ ...options, where: { ...options?.where, id } });
  }

  async getByIds(ids, options) {
    if (!ids || !Array.isArray(ids))
      throw new Error('IDs es obligatorio y debe ser un array');

    return await this.getList({ ...options, where: { ...options?.where, id: ids } });
  }

  async getByUuid(uuid, options) {
    if (!uuid)
      throw new Error('UUID es obligatorio');

    return this.getFirstOrDefault({ ...options, where: { ...options?.where, uuid } });
  }

  async getIdByUuid(uuid, options) {
    if (!uuid)
      throw new Error('UUID es obligatorio');

    if (Array.isArray(uuid)) {
      const rows = await this.getList({ ...options, where: { ...options?.where, uuid } });
      return rows.map(r => r.id);
    } else {
      const row = await this.getFirstOrDefault({ ...options, where: { ...options?.where, uuid } });
      return row?.id;
    }
  }

  async update(data, options = {}) {
    if (!data || typeof data !== 'object')
      throw new Error('Data es obligatorio y debe ser un objeto');

    options = this.getModelOptions(options);
    if (this.auditable && !options.skipAudit) {
      data.updatedAt ??= new Date();
      data.updatedById ??= await this.getCurrentUserId(options);
    }

    return await this.model.update(data, options);
  }

  async updateByWhere(data, where, options = {}) {
    if (!where || typeof where !== 'object')
      throw new Error('La cláusula where es obligatoria y debe ser un objeto');

    if (!data || typeof data !== 'object')
      throw new Error('Data es obligatorio y debe ser un objeto');

    return await this.update(data, { ...options, where: { ...options?.where, ...where } });
  }

  async updateById(id, data, options) {
    if (!id)
      throw new Error('ID es obligatorio');

    const [updatedCount] = await this.updateByWhere(data, { id }, options);
    if (updatedCount === 0)
      throw new Error(`No se encontró el registro con ID ${id}`);

    return await this.getById(id);
  }

  async deleteByWhere(where, options) {
    if (!where || typeof where !== 'object')
      throw new Error('La cláusula where del objeto a eliminar es obligatoria y debe ser un objeto');

    options = this.getModelOptions(options);

    if (this.softDelete) {
      const data = {
        deletedAt: new Date(),
        deletedById: await this.getCurrentUserId(options),
      };
      return await this.model.update(data, { ...options, where: { ...where, ...options?.where } });
    } else {
      return await this.model.destroy({ ...options, where: { ...where, ...options?.where } });
    }
  }

  async deleteById(id, options) {
    if (!id)
      throw new Error('El ID del elemento a eliminar es obligatorio');

    const obj = await this.getById(id);
    if (!obj)
      throw new Error('Elemento no encontrado');

    return await this.deleteByWhere({ id }, options);
  }

  async deleteByUuid(uuid, options) {
    if (!uuid)
      throw new Error('El UUID del elemento a eliminar es obligatorio');

    const obj = await this.getByUuid(uuid);
    if (!obj)
      throw new Error('Elemento no encontrado');

    return await this.deleteByWhere({ uuid }, options);
  }
}