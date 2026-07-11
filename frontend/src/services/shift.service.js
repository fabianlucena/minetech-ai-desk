import Api from '../utils/api.js';

export async function getShifts(params) {
  let shifts = await Api.getJson('shifts', params);
  shifts = shifts.map(shift => ({
    ...shift,
    startDate: new Date(shift.startDate),
    endDate: new Date(shift.endDate),
  }));
  return shifts;
}

export async function getShift(uuid, params) {
  let shift = await Api.getJson(`shifts/${uuid}`, params);
  shift.startDate = new Date(shift.startDate);
  shift.endDate = new Date(shift.endDate);
  return shift;
}

export async function getTypes(params) {
  return await Api.getJson('shifts/types', params);
}

export async function getTechnicians(params) {
  return await Api.getJson('shifts/technicians', params);
}

export async function createShift(data) {
  return await Api.postJson('shifts', { body: data });
}

export async function updateShift(uuid, data) {
  return await Api.putJson(`shifts/${uuid}`, { body: data });
}

export async function deleteShift(uuid) {
  return await Api.deleteJson(`shifts/${uuid}`);
}

export async function restoreShift(uuid) {
  return await Api.patchJson(`shifts/${uuid}/restore`);
}