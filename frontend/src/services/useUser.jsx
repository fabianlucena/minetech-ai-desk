import useApi from './useApi';

export default function useLoginService() {
  const api = useApi();

  async function getUsers(params) {
    return await api.getJson('v1/users', params);
  }

  async function getUser(uuid, params) {
    return await api.getJson(`v1/users/${uuid}`, params);
  }

  async function getRoles(params) {
    return await api.getJson('v1/users/roles', params);
  }

  async function createUser(data) {
    return await api.postJson('v1/users', { body: data });
  }

  async function updateUser(uuid, data) {
    return await api.putJson(`v1/users/${uuid}`, { body: data });
  }

  async function deleteUser(uuid) {
    return await api.deleteJson(`v1/users/${uuid}`);
  }

  async function restoreUser(uuid) {
    return await api.patchJson(`v1/users/${uuid}/restore`);
  }

  async function updateUserPassword(uuid, password) {
    return await api.patchJson(`v1/users/${uuid}/password`, { body: { password } });
  }

  return {
    getUsers,
    getUser,
    getRoles,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    updateUserPassword,
  };
}