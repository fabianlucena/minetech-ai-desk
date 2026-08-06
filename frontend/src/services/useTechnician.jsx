import useApi from './useApi';
import useUser from './useUser';

export default function useTechnician() {
  const api = useApi();
  const { normalizeUser } = useUser();

  function normalizeTechnician(technician) {
    return {
      ...technician,
      createdAt: technician.createdAt && new Date(technician.createdAt),
      updatedAt: technician.updatedAt && new Date(technician.updatedAt),
      deletedAt: technician.deletedAt && new Date(technician.deletedAt),
    }
  }

  return {
    normalizeTechnician,
    getTechnicians: (params) => api.getJson('v1/technicians', { normalizeItem: normalizeTechnician, ...params }),
    getTechnician: (uuid, params) => api.getJson(`v1/technicians/${uuid}`, { normalizeItem: normalizeTechnician, ...params }),
    createTechnician: (data) => api.postJson('v1/technicians', { normalizeItem: normalizeTechnician, body: data }),
    updateTechnician: (uuid, data) => api.putJson(`v1/technicians/${uuid}`, { normalizeItem: normalizeTechnician, body: data }),
    deleteTechnician: (uuid) => api.deleteJson(`v1/technicians/${uuid}`),
    restoreTechnician: (uuid) => api.patchJson(`v1/technicians/${uuid}/restore`),
    getTechnicianUsers: (params) => api.getJson('v1/technicians/users', { normalizeItem: normalizeUser, ...params }),
  };
}