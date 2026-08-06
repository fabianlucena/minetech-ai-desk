import useApi from './useApi';

export default function useRequester() {
  const api = useApi();

  function normalizeRequester(requester) {
    if (!requester)
      return null;
    
    return {
      ...requester,
      createdAt: requester.createdAt && new Date(requester.createdAt),
      updatedAt: requester.updatedAt && new Date(requester.updatedAt),
      deletedAt: requester.deletedAt && new Date(requester.deletedAt),
      bannedAt: requester.bannedAt && new Date(requester.bannedAt),
    };
  }
  
  return {
    normalizeRequester,
    getRequesters: (params) => api.getJson('v1/requesters', { normalizeItem: normalizeRequester, ...params }),
    getRequester: (uuid, params) => api.getJson(`v1/requesters/${uuid}`, { normalizeItem: normalizeRequester, ...params }),
    createRequester: (data) => api.postJson('v1/requesters', { normalizeItem: normalizeRequester, body: data }),
    updateRequester: (uuid, data) => api.putJson(`v1/requesters/${uuid}`, { normalizeItem: normalizeRequester, body: data }),
    deleteRequester: (uuid) => api.deleteJson(`v1/requesters/${uuid}`),
    restoreRequester: (uuid) => api.patchJson(`v1/requesters/${uuid}/restore`, { normalizeItem: normalizeRequester }),
    banRequester: (uuid, data) => api.patchJson(`v1/requesters/${uuid}/ban`, { normalizeItem: normalizeRequester, body: data }),
    unbanRequester: (uuid) => api.patchJson(`v1/requesters/${uuid}/unban`, { normalizeItem: normalizeRequester }),
  };
}