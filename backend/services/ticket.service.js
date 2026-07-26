import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class TicketService extends ModelService {
  constructor() {
    super({ model: getDependency('ticketModel') });
  }

  get validPropertiesForCreation() {
    return ['code', 'clientId', 'requesterId', 'technicianId', 'shiftId', 'status', 'resolvedAt'];
  }

  get validPropertiesForUpdate() {
    return ['code', 'clientId', 'requesterId', 'technicianId', 'shiftId', 'status', 'resolvedAt'];
  }

  async validateForCreation(data, options) {
    if (!data.code) {
      const lastTicket = await this.getFirstOrDefault({
        ...options,
        where: {
          ...options?.where,
          clientId: data.clientId || null,
        },
        order: [['createdAt', 'DESC']]
      });

      data.code = lastTicket ? String((Number.parseInt(lastTicket.code, 10) || 0) + 1) : '1';
    }

    if (!data.status)
      throw new Error('El estado del ticket es obligatorio');

    return await super.validateForCreation(data, options);
  }
}