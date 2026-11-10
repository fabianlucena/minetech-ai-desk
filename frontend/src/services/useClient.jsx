import { useMemo } from 'react';
import useApi from './useApi';
import { useCallback } from 'react';

function normalizeClient(client) {
  if (!client)
    return null;
  
  return {
    ...client,
    createdAt: client.createdAt && new Date(client.createdAt),
    updatedAt: client.updatedAt && new Date(client.updatedAt),
    deletedAt: client.deletedAt && new Date(client.deletedAt),
  }
}

function normalizeClientStatus(status) {
  return {
    ...status,
  }
}

export default function useClient() {
  const api = useApi();

  const getClients = useCallback((params) => api.getJson('v1/clients', { normalizeItem: normalizeClient, ...params }), [api]);
  const getClient = useCallback((uuid, params) => api.getJson(`v1/clients/${uuid}`, { normalizeItem: normalizeClient, ...params }), [api]);
  const createClient = useCallback((data) => api.postJson('v1/clients', { normalizeItem: normalizeClient, body: data }), [api]);
  const updateClient = useCallback((uuid, data) => api.putJson(`v1/clients/${uuid}`, { normalizeItem: normalizeClient, ...data }), [api]);
  const deleteClient = useCallback((uuid) => api.deleteJson(`v1/clients/${uuid}`), [api]);
  const restoreClient = useCallback((uuid) => api.patchJson(`v1/clients/${uuid}/restore`), [api]);
  const getStatus = useCallback((params) => api.getJson('v1/clients/status', { normalizeItem: normalizeClientStatus, ...params }), [api]);
 
  return useMemo(() => ({
    normalizeClient,
    normalizeClientStatus,
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    restoreClient,
    getStatus,
  }), [getClients, getClient, createClient, updateClient, deleteClient, restoreClient, getStatus]);
}