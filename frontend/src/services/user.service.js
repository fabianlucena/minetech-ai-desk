import Api from '../utils/api.js';

export async function getUsers(params) {
    return await Api.getJson('users', { params });
}

export async function getUser(uuid, params) {
    return await Api.getJson(`users/${uuid}`, { params });
}

export async function getRoles(params) {
    return await Api.getJson('users/roles', { params });
}