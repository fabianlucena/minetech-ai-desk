import Api from '../utils/api.js';

export async function getRequesters(params) {
  return await Api.getJson('v1/requesters', params);
}

export async function getRequester(uuid, params) {
  return await Api.getJson(`v1/requesters/${uuid}`, params);
}

export async function createRequester(data) {
  return await Api.postJson('v1/requesters', { body: data });
}

export async function updateRequester(uuid, data) {
  return await Api.putJson(`v1/requesters/${uuid}`, { body: data });
}

export async function deleteRequester(uuid) {
  return await Api.deleteJson(`v1/requesters/${uuid}`);
}

export async function restoreRequester(uuid) {
  return await Api.patchJson(`v1/requesters/${uuid}/restore`);
}