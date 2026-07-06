import Api from '../utils/api.js';

export async function getTechnicians(params) {
  return await Api.getJson('technicians', params);
}

export async function getTechnician(uuid, params) {
  return await Api.getJson(`technicians/${uuid}`, params);
}

export async function createTechnician(data) {
  return await Api.postJson('technicians', { body: data });
}

export async function updateTechnician(uuid, data) {
  return await Api.putJson(`technicians/${uuid}`, { body: data });
}

export async function deleteTechnician(uuid) {
  return await Api.deleteJson(`technicians/${uuid}`);
}

export async function restoreTechnician(uuid) {
  return await Api.patchJson(`technicians/${uuid}/restore`);
}
