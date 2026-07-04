import Api from '../utils/api.js';

export async function usersList(params) {
    return await Api.getJson('users', { params });
}

export async function usersRead(uuid, params) {
    return await Api.getJson(`users/${uuid}`, { params });
}