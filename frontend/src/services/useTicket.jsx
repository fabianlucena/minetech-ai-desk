import useApi from './useApi';

export default function useTicket() {
  const api = useApi();

  function normalizeTicket(ticket) {
    if (!ticket)
      return null;
    
    return {
      ...ticket,
      createdAt: ticket.createdAt && new Date(ticket.createdAt),
      updatedAt: ticket.updatedAt && new Date(ticket.updatedAt),
      deletedAt: ticket.deletedAt && new Date(ticket.deletedAt),
    }
  }

  return {
    normalizeTicket,
    getTickets: (params) => api.getJson('v1/tickets', { normalizeItem: normalizeTicket, ...params }),
    getTicket: (uuid, params) => api.getJson(`v1/tickets/${uuid}`, { normalizeItem: normalizeTicket, ...params }),
  };
}