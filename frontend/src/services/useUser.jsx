import { useCallback, useMemo } from 'react';
import useApi from './useApi';

function normalizeUser(user) {
  if (!user)
    return null;
  
  return {
    ...user,
    createdAt: user.createdAt && new Date(user.createdAt),
    updatedAt: user.updatedAt && new Date(user.updatedAt),
    deletedAt: user.deletedAt && new Date(user.deletedAt),
    lastLoginAt: user.lastLoginAt && new Date(user.lastLoginAt),
  }
}

export default function useUser() {
  const api = useApi();

  const getUsers = useCallback((params) => api.getJson('v1/users', { normalizeItem: normalizeUser, rowCount: true, ...params }), [api]);
  const getUser = useCallback((uuid, params) => api.getJson(`v1/users/${uuid}`, { normalizeItem: normalizeUser, ...params }), [api]);
  const getRoles = useCallback((params) => api.getJson('v1/users/roles', { normalizeItem: normalizeUser, ...params }), [api]);
  const createUser = useCallback((data) => api.postJson('v1/users', { normalizeItem: normalizeUser, body: data }), [api]);
  const updateUser = useCallback((uuid, data) => api.putJson(`v1/users/${uuid}`, { normalizeItem: normalizeUser, body: data }), [api]);
  const deleteUser = useCallback((uuid) => api.deleteJson(`v1/users/${uuid}`), [api]);
  const restoreUser = useCallback((uuid) => api.patchJson(`v1/users/${uuid}/restore`), [api]);
  const updateUserPassword = useCallback((uuid, password) => api.patchJson(`v1/users/${uuid}/password`, { body: { password } }), [api]);

  return useMemo(() => ({
    normalizeUser,
    getUsers,
    getUser,
    getRoles,
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    updateUserPassword
  }), [getUsers, getUser, getRoles, createUser, updateUser, deleteUser, restoreUser, updateUserPassword]);
}