import Api from '../utils/api.js';

export async function loginService(data) {
  return _loginService(
    'v1/login',
    {
      ...data,
      deviceToken: localStorage.getItem('deviceToken'),
    }
  );
}

export async function autoLoginService() {
  const body = {
    autoLoginToken: localStorage.getItem('autoLoginToken'),
    deviceToken: localStorage.getItem('deviceToken'),
  };

  if (body.autoLoginToken && body.deviceToken)
    return _loginService('v1/auto-login', body);
}

export async function logoutService() {
  await Api.getJson('v1/logout');
  localStorage.removeItem('autoLoginToken');
  if (Api.Authorization)
    Api.Authorization = null;
}

export async function _loginService(service, body) {
  var res = await Api.postJson(service, { body });
  await setCredentials(res);
  return res;
}

export async function setCredentials(res) {
  if (res.authorizationToken) {
    Api.Authorization = 'Bearer ' + res.authorizationToken;
    if (res.expireAt) {
      Api.AuthorizationExpireAt = new Date(res.expireAt);
    }
  }

  if (res.deviceToken) {
    localStorage.setItem('deviceToken', res.deviceToken);
  }

  if (res.autoLoginToken) {
    localStorage.setItem('autoLoginToken', res.autoLoginToken);
  } else {
    localStorage.removeItem('autoLoginToken');
  }

  return res;
}

export function clearCredentials() {
  localStorage.removeItem('autoLoginToken');
  if (Api.Authorization) {
    Api.Authorization = null;
    Api.AuthorizationExpireAt = null;
  }
}
