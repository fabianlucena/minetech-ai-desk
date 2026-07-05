import Api from '../utils/api.js';

export async function getUsers(params) {
  return await Api.getJson('users', params);
}

export async function getUser(uuid, params) {
  return await Api.getJson(`users/${uuid}`, params);
}

export async function getRoles(params) {
  return await Api.getJson('users/roles', params);
}

export async function createUser(data) {
  return await Api.postJson('users', { body: data });
}

export async function updateUser(uuid, data) {
  return await Api.putJson(`users/${uuid}`, { body: data });
}

export async function deleteUser(uuid) {
  return await Api.deleteJson(`users/${uuid}`);
}

export async function restoreUser(uuid) {
  return await Api.patchJson(`users/${uuid}/restore`);
}