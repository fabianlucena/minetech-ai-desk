import Api from '../utils/api.js';

export async function getSettings(params) {
  return await Api.getJson('v1/settings', params);
}

export async function getSetting(uuid, params) {
  return await Api.getJson(`v1/settings/${uuid}`, params);
}

export async function createSetting(data) {
  return await Api.postJson('v1/settings', { body: data });
}

export async function updateSetting(uuid, data) {
  return await Api.putJson(`v1/settings/${uuid}`, { body: data });
}

export async function deleteSetting(uuid) {
  return await Api.deleteJson(`v1/settings/${uuid}`);
}

export async function restoreSetting(uuid) {
  return await Api.patchJson(`v1/settings/${uuid}/restore`);
}