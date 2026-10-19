import getDependency from '../dependency.js';
import { TicketDTO } from '../dto/ticket.dto.js';

export async function getList(req, res) {
  const ticketService = getDependency('ticketService');
  const tickets = await ticketService.getList({
    includeDeleted: !!req.query.includeDeleted,
    includeClient: !!req.query.includeClient,
    includeRequester: !!req.query.includeRequester,
    includeTechnician: !!req.query.includeTechnician,
    includeTechnicianName: !!req.query.includeTechnicianName,
    session: req.session,
  });
  res.json(tickets.map(u => new TicketDTO(u)));
}

export async function getByUuid(req, res) {
  const ticketService = getDependency('ticketService');
  const ticket = await ticketService.getByUuid(req.params.uuid, {
    includeClient: !!req.query.includeClient,
    includeRequester: !!req.query.includeRequester,
    includeTechnician: !!req.query.includeTechnician,
    includeTechnicianName: !!req.query.includeTechnicianName,
    session: req.session,
  });
  res.json(new TicketDTO(ticket));
}
