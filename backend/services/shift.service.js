import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';
import { Op } from 'sequelize';

export default class ShiftService extends ModelService {
  constructor() {
    super({ model: getDependency('shiftModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    if (options.includeTechnician) {
      options.include = options.include || [];
      options.include.push({
        model: getDependency('technicianModel'),
        as: 'technician'
      }),
      delete options.includeTechnician;
    }

    if (options.from && options.to) {
      options.where = options.where || {};
      options.where.start = { [Op.lt]: options.to };
      options.where.end = { [Op.gt]: options.from };
    }

    return options;
  }

  get validPropertiesForCreation() {
    return ['technicianId', 'type', 'start', 'end'];
  }

  get validPropertiesForUpdate() {
    return ['technicianId', 'type', 'start', 'end'];
  }

  async validateForCreation(data, options) {
    if (!data.technicianId) {
      if (data.technicianUuid) {
        const technicianService = getDependency('technicianService');
        data.technicianId = await technicianService.getIdByUuid(data.technicianUuid, { session: options?.session });
        if (!data.technicianId)
          throw new Error('Técnico no encontrado');

        delete data.technicianUuid;
      } else
        throw new Error('El técnico es obligatorio');
    }

    if (!data.type)
      throw new Error('El tipo de turno es obligatorio');

    if (!data.start)
      throw new Error('La fecha y hora de inicio de turno es obligatoria');

    if (!data.end)
      throw new Error('La fecha y hora de finalización de turno es obligatoria');

    return await super.validateForCreation(data, options);
  }

  async validateForUpdate(data, options) {
    if (!data.technicianId) {
      if (data.technicianUuid) {
        const technicianService = getDependency('technicianService');
        data.technicianId = await technicianService.getIdByUuid(data.technicianUuid, { session: options?.session });
        if (!data.technicianId)
          throw new Error('Técnico no encontrado');

        delete data.technicianUuid;
      } else
        throw new Error('El técnico es obligatorio');
    }

    return await super.validateForUpdate(data, options);
  }

  async create(data, options) {
    const shift = await super.create(data, options);

    const globalOptions = { session: options?.session };

    return await this.getById(shift.id, { includeTechnician: true });
  }

  async updateByUuid(uuid, data, options) {
    if (!uuid)
      throw new Error('El UUID de turno es obligatorio');

    const shift = await this.getByUuid(uuid);
    if (!shift)
      throw new Error('Turno no encontrado');

    const globalOptions = { session: options?.session };
    const result = await this.updateById(shift.id, data, globalOptions);

    return result;
  }
}