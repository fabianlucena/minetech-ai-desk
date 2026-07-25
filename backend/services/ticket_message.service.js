import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class TicketMessageService extends ModelService {
  constructor() {
    super({ model: getDependency('ticketMessageModel') });
  }

  get validPropertiesForCreation() {
    return ['ticketId', 'senderType', 'senderId', 'message'];
  }

  get validPropertiesForUpdate() {
    return ['ticketId', 'senderType', 'senderId', 'message'];
  }
}