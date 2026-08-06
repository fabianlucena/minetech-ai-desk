import useApi from './useApi';

export default function useLoginService() {
  const api = useApi();

  async function getShifts(params) {
    let shifts = await api.getJson('v1/shifts', params);
    shifts = shifts.map(shift => ({
      ...shift,
      start: new Date(shift.start),
      end: new Date(shift.end),
    }));
    return shifts;
  }

  async function getShift(uuid, params) {
    let shift = await api.getJson(`v1/shifts/${uuid}`, params);
    shift.start = new Date(shift.start);
    shift.end = new Date(shift.end);
    return shift;
  }

  async function getTypes(params) {
    return await api.getJson('v1/shifts/types', params);
  }

  async function getTechnicians(params) {
    return await api.getJson('v1/shifts/technicians', params);
  }

  async function createShift(data) {
    return await api.postJson('v1/shifts', { body: data });
  }

  async function updateShift(uuid, data) {
    return await api.putJson(`v1/shifts/${uuid}`, { body: data });
  }

  async function deleteShift(uuid) {
    return await api.deleteJson(`v1/shifts/${uuid}`);
  }

  async function restoreShift(uuid) {
    return await api.patchJson(`v1/shifts/${uuid}/restore`);
  }

  return {
    getShifts,
    getShift,
    getTypes,
    getTechnicians,
    createShift,
    updateShift,
    deleteShift,
    restoreShift,
  };
}