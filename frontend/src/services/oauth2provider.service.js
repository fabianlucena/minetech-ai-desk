import Api from '../utils/api.js';

export async function getOAuth2ProvidersService() {
  return await Api.getJson('v1/oauth2/providers');
}

export async function oAuth2Callback(name, action, query, options) {
  return await Api.getJson(`v1/oauth2/callback/${name}/${action}`, { ...options, query });
}
