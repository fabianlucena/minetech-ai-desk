import { useCallback, useMemo } from 'react';
import useApi from './useApi';

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

export default function useTicket() {
  const api = useApi();

  const getTickets = useCallback((params) => api.getJson('v1/tickets', { normalizeItem: normalizeTicket, ...params }), [api]);
  const getTicket = useCallback((uuid, params) => api.getJson(`v1/tickets/${uuid}`, { normalizeItem: normalizeTicket, ...params }), [api]);

  return useMemo(() => ({
    normalizeTicket,
    getTickets,
    getTicket,
  }), [getTickets, getTicket]);
}