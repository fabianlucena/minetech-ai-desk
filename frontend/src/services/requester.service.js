import Api from '../utils/api.js';

export async function getRequesters(params) {
  return await Api.getJson('requesters', params);
}

export async function getRequester(uuid, params) {
  return await Api.getJson(`requesters/${uuid}`, params);
}

export async function createRequester(data) {
  return await Api.postJson('requesters', { body: data });
}

export async function updateRequester(uuid, data) {
  return await Api.putJson(`requesters/${uuid}`, { body: data });
}

export async function deleteRequester(uuid) {
  return await Api.deleteJson(`requesters/${uuid}`);
}

export async function restoreRequester(uuid) {
  return await Api.patchJson(`requesters/${uuid}/restore`);
}