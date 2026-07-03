import Api from '../utils/api.js';

export async function userService(params) {
    return await Api.getJson('users', { params });
}