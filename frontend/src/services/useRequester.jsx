import { useCallback, useMemo } from 'react';
import useApi from './useApi';

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

export default function useRequester() {
  const api = useApi();
  
  const getRequesters = useCallback((params) => api.getJson('v1/requesters', { normalizeItem: normalizeRequester, ...params }), [api]);
  const getRequester = useCallback((uuid, params) => api.getJson(`v1/requesters/${uuid}`, { normalizeItem: normalizeRequester, ...params }), [api]);
  const createRequester = useCallback((data) => api.postJson('v1/requesters', { normalizeItem: normalizeRequester, body: data }), [api]);
  const updateRequester = useCallback((uuid, data) => api.putJson(`v1/requesters/${uuid}`, { normalizeItem: normalizeRequester, body: data }), [api]);
  const deleteRequester = useCallback((uuid) => api.deleteJson(`v1/requesters/${uuid}`), [api]);
  const restoreRequester = useCallback((uuid) => api.patchJson(`v1/requesters/${uuid}/restore`, { normalizeItem: normalizeRequester }), [api]);
  const banRequester = useCallback((uuid, data) => api.patchJson(`v1/requesters/${uuid}/ban`, { normalizeItem: normalizeRequester, body: data }), [api]);
  const unbanRequester = useCallback((uuid) => api.patchJson(`v1/requesters/${uuid}/unban`, { normalizeItem: normalizeRequester }), [api]);

  return useMemo(() => ({
    normalizeRequester,
    getRequesters,
    getRequester,
    createRequester,
    updateRequester,
    deleteRequester,
    restoreRequester,
    banRequester,
    unbanRequester,
  }), [getRequesters, getRequester, createRequester, updateRequester, deleteRequester, restoreRequester, banRequester, unbanRequester]);
}