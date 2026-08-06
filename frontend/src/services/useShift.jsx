import useApi from './useApi';
import useTechnician from './useTechnician';

export default function useShift() {
  const api = useApi();
  const { normalizeTechnician } = useTechnician();

  function normalizeShift(shift) {
    return {
      ...shift,
      start: shift.start && new Date(shift.start),
      end: shift.end && new Date(shift.end),
      createdAt: shift.createdAt && new Date(shift.createdAt),
      updatedAt: shift.updatedAt && new Date(shift.updatedAt),
      deletedAt: shift.deletedAt && new Date(shift.deletedAt),
    }
  }

  function normalizeShiftType(type) {
    return {
      ...type,
    }
  }

  return {
    normalizeShift,
    normalizeShiftType,
    getShifts: (params) => api.getJson('v1/shifts', { normalizeItem: normalizeShift, ...params }),
    getShift: (uuid, params) => api.getJson(`v1/shifts/${uuid}`, { normalizeItem: normalizeShift, ...params }),
    getTypes: (params) => api.getJson('v1/shifts/types', { normalizeItem: normalizeShiftType, ...params }),
    getTechnicians: (params) => api.getJson('v1/shifts/technicians', { normalizeItem: normalizeTechnician, ...params }),
    createShift: (data) => api.postJson('v1/shifts', { normalizeItem: normalizeShift, body: data }),
    updateShift: (uuid, data) => api.putJson(`v1/shifts/${uuid}`, { normalizeItem: normalizeShift, body: data }),
    deleteShift: (uuid) => api.deleteJson(`v1/shifts/${uuid}`),
    restoreShift: (uuid) => api.patchJson(`v1/shifts/${uuid}/restore`),
  };
}