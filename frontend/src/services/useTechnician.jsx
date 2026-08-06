import useApi from './useApi';

export default function useLoginService() {
  const api = useApi();

  async function getTechnicians(params) {
    return await api.getJson('v1/technicians', params);
  }

  async function getTechnician(uuid, params) {
    return await api.getJson(`v1/technicians/${uuid}`, params);
  }

  async function createTechnician(data) {
    return await api.postJson('v1/technicians', { body: data });
  }

  async function updateTechnician(uuid, data) {
    return await api.putJson(`v1/technicians/${uuid}`, { body: data });
  }

  async function deleteTechnician(uuid) {
    return await api.deleteJson(`v1/technicians/${uuid}`);
  }

  async function restoreTechnician(uuid) {
    return await api.patchJson(`v1/technicians/${uuid}/restore`);
  }

  async function getTechnicianUsers(params) {
    return await api.getJson('v1/technicians/users', params);
  }

  return {
    getTechnicians,
    getTechnician,
    createTechnician,
    updateTechnician,
    deleteTechnician,
    restoreTechnician,
    getTechnicianUsers,
  };
}