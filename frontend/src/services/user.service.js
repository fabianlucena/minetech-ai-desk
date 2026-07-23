import Api from '../utils/api.js';

export async function getUsers(params) {
  return await Api.getJson('v1/users', params);
}

export async function getUser(uuid, params) {
  return await Api.getJson(`v1/users/${uuid}`, params);
}

export async function getRoles(params) {
  return await Api.getJson('v1/users/roles', params);
}

export async function createUser(data) {
  return await Api.postJson('v1/users', { body: data });
}

export async function updateUser(uuid, data) {
  return await Api.putJson(`v1/users/${uuid}`, { body: data });
}

export async function deleteUser(uuid) {
  return await Api.deleteJson(`v1/users/${uuid}`);
}

export async function restoreUser(uuid) {
  return await Api.patchJson(`v1/users/${uuid}/restore`);
}

export async function updateUserPassword(uuid, password) {
  return await Api.patchJson(`v1/users/${uuid}/password`, { body: { password } });
}