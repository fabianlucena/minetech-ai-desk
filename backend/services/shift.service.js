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
      options.where.startDate = { [Op.lt]: options.to };
      options.where.endDate = { [Op.gt]: options.from };
    }

    return options;
  }

  async create(data, options) {
    if (!data.technicianId) {
      if (data.technicianUuid) {
        const technicianService = getDependency('technicianService');
        data.technicianId = await technicianService.getIdByUuid(data.technicianUuid, { session: options?.session });
        if (!data.technicianId)
          throw new Error('Técnico no encontrado');
      } else
        throw new Error('El técnico es obligatorio');
    }

    if (!data.type)
      throw new Error('El tipo de turno es obligatorio');

    if (!data.startDate)
      throw new Error('La fecha y hora de inicio de turno es obligatoria');

    if (!data.endDate)
      throw new Error('La fecha y hora de finalización de turno es obligatoria');

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