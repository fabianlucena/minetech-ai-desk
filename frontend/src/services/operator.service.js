import Api from '../utils/api.js';

export async function getOperators(params) {
  return await Api.getJson('operators', params);
}

export async function getOperator(uuid, params) {
  return await Api.getJson(`operators/${uuid}`, params);
}

export async function createOperator(data) {
  return await Api.postJson('operators', { body: data });
}

export async function updateOperator(uuid, data) {
  return await Api.putJson(`operators/${uuid}`, { body: data });
}

export async function deleteOperator(uuid) {
  return await Api.deleteJson(`operators/${uuid}`);
}

export async function restoreOperator(uuid) {
  return await Api.patchJson(`operators/${uuid}/restore`);
}