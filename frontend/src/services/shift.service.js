import Api from '../utils/api.js';

export async function getShifts(params) {
  let shifts = await Api.getJson('v1/shifts', params);
  shifts = shifts.map(shift => ({
    ...shift,
    start: new Date(shift.start),
    end: new Date(shift.end),
  }));
  return shifts;
}

export async function getShift(uuid, params) {
  let shift = await Api.getJson(`v1/shifts/${uuid}`, params);
  shift.start = new Date(shift.start);
  shift.end = new Date(shift.end);
  return shift;
}

export async function getTypes(params) {
  return await Api.getJson('v1/shifts/types', params);
}

export async function getTechnicians(params) {
  return await Api.getJson('v1/shifts/technicians', params);
}

export async function createShift(data) {
  return await Api.postJson('v1/shifts', { body: data });
}

export async function updateShift(uuid, data) {
  return await Api.putJson(`v1/shifts/${uuid}`, { body: data });
}

export async function deleteShift(uuid) {
  return await Api.deleteJson(`v1/shifts/${uuid}`);
}

export async function restoreShift(uuid) {
  return await Api.patchJson(`v1/shifts/${uuid}/restore`);
}