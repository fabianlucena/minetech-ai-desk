import { useCallback, useMemo } from 'react';
import useApi from './useApi';
import useUser from './useUser';

function normalizeTechnician(technician) {
  if (!technician)
    return null;
  
  return {
    ...technician,
    createdAt: technician.createdAt && new Date(technician.createdAt),
    updatedAt: technician.updatedAt && new Date(technician.updatedAt),
    deletedAt: technician.deletedAt && new Date(technician.deletedAt),
  }
}

export default function useTechnician() {
  const api = useApi();
  const { normalizeUser } = useUser();

  const getTechnicians = useCallback((params) => api.getJson('v1/technicians', { normalizeItem: normalizeTechnician, ...params }), [api]);
  const getTechnician = useCallback((uuid, params) => api.getJson(`v1/technicians/${uuid}`, { normalizeItem: normalizeTechnician, ...params }), [api]);
  const createTechnician = useCallback((data) => api.postJson('v1/technicians', { normalizeItem: normalizeTechnician, body: data }), [api]);
  const updateTechnician = useCallback((uuid, data) => api.putJson(`v1/technicians/${uuid}`, { normalizeItem: normalizeTechnician, body: data }), [api]);
  const deleteTechnician = useCallback((uuid) => api.deleteJson(`v1/technicians/${uuid}`), [api]);
  const restoreTechnician = useCallback((uuid) => api.patchJson(`v1/technicians/${uuid}/restore`), [api]);
  const getTechnicianUsers = useCallback((params) => api.getJson('v1/technicians/users', { normalizeItem: normalizeUser, ...params }), [api, normalizeUser]);

  return useMemo(() => ({
    normalizeTechnician,
    getTechnicians,
    getTechnician,
    createTechnician,
    updateTechnician,
    deleteTechnician,
    restoreTechnician,
    getTechnicianUsers,
  }), [getTechnicians, getTechnician, createTechnician, updateTechnician, deleteTechnician, restoreTechnician, getTechnicianUsers]);
}