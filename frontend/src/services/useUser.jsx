import useApi from './useApi';

export default function useUser() {
  const api = useApi();

  function normalizeUser(user) {
    return {
      ...user,
      createdAt: user.createdAt && new Date(user.createdAt),
      updatedAt: user.updatedAt && new Date(user.updatedAt),
      deletedAt: user.deletedAt && new Date(user.deletedAt),
      lastLoginAt: user.lastLoginAt && new Date(user.lastLoginAt),
    }
  }

  return {
    normalizeUser,
    getUsers: (params) => api.getJson('v1/users', { normalizeItem: normalizeUser, ...params }),
    getUser: (uuid, params) => api.getJson(`v1/users/${uuid}`, { normalizeItem: normalizeUser, ...params }),
    getRoles: (params) => api.getJson('v1/users/roles', { normalizeItem: normalizeUser, ...params }),
    createUser: (data) => api.postJson('v1/users', { normalizeItem: normalizeUser, body: data }),
    updateUser: (uuid, data) => api.putJson(`v1/users/${uuid}`, { normalizeItem: normalizeUser, body: data }),
    deleteUser: (uuid) => api.deleteJson(`v1/users/${uuid}`),
    restoreUser: (uuid) => api.patchJson(`v1/users/${uuid}/restore`),
    updateUserPassword: (uuid, password) => api.patchJson(`v1/users/${uuid}/password`, { body: { password } }),
  };
}