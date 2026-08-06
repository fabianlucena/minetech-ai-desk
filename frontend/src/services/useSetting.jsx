import useApi from './useApi';

export default function useSetting() {
  const api = useApi();

  function normalizeSetting(setting) {
    return {
      ...setting,
      createdAt: setting.createdAt && new Date(setting.createdAt),
      updatedAt: setting.updatedAt && new Date(setting.updatedAt),
      deletedAt: setting.deletedAt && new Date(setting.deletedAt),
    }
  }

  return {
    normalizeSetting,
    getSettings: (params) => api.getJson('v1/settings', { normalizeItem: normalizeSetting, ...params }),
    getSetting: (uuid, params) => api.getJson(`v1/settings/${uuid}`, { normalizeItem: normalizeSetting, ...params }),
    createSetting: (data) => api.postJson('v1/settings', { normalizeItem: normalizeSetting, body: data }),
    updateSetting: (uuid, data) => api.putJson(`v1/settings/${uuid}`, { normalizeItem: normalizeSetting, ...data }),
    deleteSetting: (uuid) => api.deleteJson(`v1/settings/${uuid}`),
    restoreSetting: (uuid) => api.patchJson(`v1/settings/${uuid}/restore`),
  };
}