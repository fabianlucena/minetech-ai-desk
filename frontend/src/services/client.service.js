import Api from '../utils/api.js';

export async function getClients(params) {
  return await Api.getJson('clients', params);
}

export async function getClient(uuid, params) {
  return await Api.getJson(`clients/${uuid}`, params);
}

export async function createClient(data) {
  return await Api.postJson('clients', { body: data });
}

export async function updateClient(uuid, data) {
  return await Api.putJson(`clients/${uuid}`, { body: data });
}

export async function deleteClient(uuid) {
  return await Api.deleteJson(`clients/${uuid}`);
}

export async function restoreClient(uuid) {
  return await Api.patchJson(`clients/${uuid}/restore`);
}

export async function getRoles(params) {
  return await Api.getJson('users/roles', params);
}

export async function getStatus(params) {
  return await Api.getJson('clients/status', params);
}