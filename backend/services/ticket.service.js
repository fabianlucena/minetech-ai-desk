import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class TicketService extends ModelService {
  constructor() {
    super({ model: getDependency('ticketModel') });
  }

  async getOpenByRequesterId(requesterId, options = {}) {
    if (!requesterId)
      throw new Error('El ID del solicitante es obligatorio');

    return this.getFirstOrDefault({
      ...options,
      where: {
        ...options?.where,
        requesterId,
        status: 'open',
      },
      order: [['createdAt', 'DESC']]
    });
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

      data.code = lastTicket ? `${lastTicket.code + 1}` : '1';
    }

    if (!data.status)
      throw new Error('El estado del ticket es obligatorio');

    return await super.validateForCreation(data, options);
  }

  async addMessage({ requesterId, message }) {
    const ticket = (await this.getOpenByRequesterId(requesterId))
      || (await this.create({
        requesterId,
        status: 'open'
      }));
      
    const messageService = getDependency('messageService');
    ticket.message = await messageService.create({
      ticketId: ticket.id,
      requesterId,
      content: message,
      direction: 'incoming',
    });
  }
}