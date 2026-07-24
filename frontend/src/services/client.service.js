import Api from '../utils/api.js';

export async function getClients(params) {
  return await Api.getJson('v1/clients', params);
}

export async function getClient(uuid, params) {
  return await Api.getJson(`v1/clients/${uuid}`, params);
}

export async function createClient(data) {
  return await Api.postJson('v1/clients', { body: data });
}

export async function updateClient(uuid, data) {
  return await Api.putJson(`v1/clients/${uuid}`, { body: data });
}

export async function deleteClient(uuid) {
  return await Api.deleteJson(`v1/clients/${uuid}`);
}

export async function restoreClient(uuid) {
  return await Api.patchJson(`v1/clients/${uuid}/restore`);
}

export async function getStatus(params) {
  return await Api.getJson('v1/clients/status', params);
}