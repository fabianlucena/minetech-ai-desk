import useApi from './useApi';

export default function useClient() {
  const api = useApi();

  function normalizeClient(client) {
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

  return {
    normalizeClient,
    normalizeClientStatus,
    getClients: (params) => api.getJson('v1/clients', { normalizeItem: normalizeClient, ...params }),
    getClient: (uuid, params) => api.getJson(`v1/clients/${uuid}`, { normalizeItem: normalizeClient, ...params }),
    createClient: (data) => api.postJson('v1/clients', { normalizeItem: normalizeClient, body: data }),
    updateClient: (uuid, data) => api.putJson(`v1/clients/${uuid}`, { normalizeItem: normalizeClient, ...data }),
    deleteClient: (uuid) => api.deleteJson(`v1/clients/${uuid}`),
    restoreClient: (uuid) => api.patchJson(`v1/clients/${uuid}/restore`),
    getStatus: (params) => api.getJson('v1/clients/status', { normalizeItem: normalizeClientStatus, ...params }),
  };
}