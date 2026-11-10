import { useCallback, useMemo } from 'react';
import useApi from './useApi';

function normalizeSetting(setting) {
  if (!setting)
    return null;
  
  return {
    ...setting,
    createdAt: setting.createdAt && new Date(setting.createdAt),
    updatedAt: setting.updatedAt && new Date(setting.updatedAt),
    deletedAt: setting.deletedAt && new Date(setting.deletedAt),
  }
}

export default function useSetting() {
  const api = useApi();

  const getSettings = useCallback((params) => api.getJson('v1/settings', { normalizeItem: normalizeSetting, ...params }), [api]);
  const getSetting = useCallback((uuid, params) => api.getJson(`v1/settings/${uuid}`, { normalizeItem: normalizeSetting, ...params }), [api]);
  const createSetting = useCallback((data) => api.postJson('v1/settings', { normalizeItem: normalizeSetting, body: data }), [api]);
  const updateSetting = useCallback((uuid, data) => api.putJson(`v1/settings/${uuid}`, { normalizeItem: normalizeSetting, ...data }), [api]);
  const deleteSetting = useCallback((uuid) => api.deleteJson(`v1/settings/${uuid}`), [api]);
  const restoreSetting = useCallback((uuid) => api.patchJson(`v1/settings/${uuid}/restore`), [api]);

  return useMemo(() => ({
    normalizeSetting,
    getSettings,
    getSetting,
    createSetting,
    updateSetting,
    deleteSetting,
    restoreSetting,
  }), [getSettings, getSetting, createSetting, updateSetting, deleteSetting, restoreSetting]);
}