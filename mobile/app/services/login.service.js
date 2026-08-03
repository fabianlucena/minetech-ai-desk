import Api from '../utils/api.js';
import asyncStorage from '@react-native-async-storage/async-storage';

export async function loginService(data, options) {
  return _loginService(
    'v1/login',
    {
      ...data,
      deviceToken: await asyncStorage.getItem('deviceToken'),
    },
    options
  );
}

export async function autoLoginService(options) {
  const body = {
    autoLoginToken: await asyncStorage.getItem('autoLoginToken'),
    deviceToken: await asyncStorage.getItem('deviceToken'),
  };

  if (body.autoLoginToken && body.deviceToken)
    return _loginService('v1/auto-login', body, options);
}

export async function logoutService(options) {
  await asyncStorage.removeItem('autoLoginToken');
  await Api.getJson('v1/logout', options);
  if (Api.Authorization)
    Api.Authorization = null;
}

export async function _loginService(service, body, options) {
  var res = await Api.postJson(service, { ...options, body });
  await setCredentials(res);
  return res;
}

export async function setCredentials(res) {
  if (res.authorizationToken) {
    Api.authorizationToken = res.authorizationToken;
    Api.Authorization = 'Bearer ' + res.authorizationToken;
    if (res.expireAt) {
      Api.AuthorizationExpireAt = new Date(res.expireAt);
    }
  }

  if (res.deviceToken) {
    asyncStorage.setItem('deviceToken', res.deviceToken);
  }

  if (res.autoLoginToken) {
    await asyncStorage.setItem('autoLoginToken', res.autoLoginToken);
  } else {
    await asyncStorage.removeItem('autoLoginToken');
  }

  return res;
}

export async function clearCredentials() {
  await asyncStorage.removeItem('autoLoginToken');
  if (Api.Authorization) {
    Api.Authorization = null;
    Api.AuthorizationExpireAt = null;
  }
}
