import Api from '../utils/api.js';

export async function getTechnicians(params) {
  return await Api.getJson('v1/technicians', params);
}

export async function getTechnician(uuid, params) {
  return await Api.getJson(`v1/technicians/${uuid}`, params);
}

export async function createTechnician(data) {
  return await Api.postJson('v1/technicians', { body: data });
}

export async function updateTechnician(uuid, data) {
  return await Api.putJson(`v1/technicians/${uuid}`, { body: data });
}

export async function deleteTechnician(uuid) {
  return await Api.deleteJson(`v1/technicians/${uuid}`);
}

export async function restoreTechnician(uuid) {
  return await Api.patchJson(`v1/technicians/${uuid}/restore`);
}
