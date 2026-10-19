import { ClientMinDTO } from './client.dto.js';
import { RequesterMinDTO } from './requester.dto.js';
import { TechnicianMinDTO } from './technician.dto.js';
import { ticketStatusName } from '../categories/ticket_status.js';

export class TicketMinDTO {
  constructor(ticket) {
    this.uuid = ticket.uuid;
    this.name = ticket.name;
  }
}

export class TicketDTO {
  constructor(ticket) {
    this.uuid = ticket.uuid;
    this.code = ticket.code;
    this.status = ticket.status;
    this.statusName = ticketStatusName(ticket.status);
    this.client = ticket.client ? new ClientMinDTO(ticket.client) : null;
    this.requester = ticket.requester ? new RequesterMinDTO(ticket.requester) : null;
    this.technician = ticket.technician ? new TechnicianMinDTO(ticket.technician) : null;
    this.createdAt = ticket.createdAt;
    this.updatedAt = ticket.updatedAt;
    this.deletedAt = ticket.deletedAt;
  }
}