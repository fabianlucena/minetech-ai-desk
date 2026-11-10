import { useCallback, useMemo } from 'react';
import useApi from './useApi';
import useTechnician from './useTechnician';

function normalizeShift(shift) {
  if (!shift)
    return null;

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
  if (!type)
    return null;
  
  return {
    ...type,
  }
}

export default function useShift() {
  const api = useApi();
  const { normalizeTechnician } = useTechnician();

  const getShifts = useCallback((params) => api.getJson('v1/shifts', { normalizeItem: normalizeShift, ...params }), [api]);
  const getShift = useCallback((uuid, params) => api.getJson(`v1/shifts/${uuid}`, { normalizeItem: normalizeShift, ...params }), [api]);
  const getTypes = useCallback((params) => api.getJson('v1/shifts/types', { normalizeItem: normalizeShiftType, ...params }), [api]);
  const getTechnicians = useCallback((params) => api.getJson('v1/shifts/technicians', { normalizeItem: normalizeTechnician, ...params }), [api, normalizeTechnician]);
  const createShift = useCallback((data) => api.postJson('v1/shifts', { normalizeItem: normalizeShift, body: data }), [api]);
  const updateShift = useCallback((uuid, data) => api.putJson(`v1/shifts/${uuid}`, { normalizeItem: normalizeShift, body: data }), [api]);
  const deleteShift = useCallback((uuid) => api.deleteJson(`v1/shifts/${uuid}`), [api]);
  const restoreShift = useCallback((uuid) => api.patchJson(`v1/shifts/${uuid}/restore`), [api]);

  return useMemo(() => ({
    normalizeShift,
    normalizeShiftType,
    getShifts,
    getShift,
    getTypes,
    getTechnicians,
    createShift,
    updateShift,
    deleteShift,
    restoreShift,
  }), [getShifts, getShift, getTypes, getTechnicians, createShift, updateShift, deleteShift, restoreShift]);
}