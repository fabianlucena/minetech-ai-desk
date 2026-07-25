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
    return ['clientId', 'requesterId', 'technicianId', 'shiftId', 'status', 'resolvedAt'];
  }

  get validPropertiesForUpdate() {
    return ['clientId', 'requesterId', 'technicianId', 'shiftId', 'status', 'resolvedAt'];
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