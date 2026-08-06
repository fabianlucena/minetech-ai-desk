import useApi from './useApi';

export default function useLogin() {
  const api = useApi();

  async function login(data, options) {
    return _login(
      'v1/login',
      {
        ...data,
        deviceToken: localStorage.getItem('deviceToken'),
      },
      options
    );
  }

  async function autoLogin(options) {
    const body = {
      autoLoginToken: localStorage.getItem('autoLoginToken'),
      deviceToken: localStorage.getItem('deviceToken'),
    };

    if (body.autoLoginToken && body.deviceToken)
      return _login('v1/auto-login', body, options);
  }

  async function _login(service, body, options) {
    var res = await api.postJson(service, { ...options, body });
    await setCredentials(res);
    return res;
  }

  async function logout(options) {
    options = {
      authorization: api.authorization,
      ...options,
    };

    clearCredentials();
    localStorage.removeItem('autoLoginToken');
    await api.getJson('v1/logout', options);
  }

  async function setCredentials(data) {
    if (data.authorizationToken) {
      api.setAuthorizationToken(data.authorizationToken);
      api.setAutorization('Bearer ' + data.authorizationToken);
      if (data.expireAt) {
        api.setAuthorizationExpireAt(new Date(data.expireAt));
      }
    }

    if (data.deviceToken) {
      localStorage.setItem('deviceToken', data.deviceToken);
    }

    if (data.autoLoginToken) {
      localStorage.setItem('autoLoginToken', data.autoLoginToken);
    } else {
      localStorage.removeItem('autoLoginToken');
    }

    return data;
  }

  async function clearCredentials() {
    localStorage.removeItem('autoLoginToken');
    api.setAuthorizationToken(null);
    api.setAutorization(null);
    api.setAuthorizationExpireAt(null);
  }
  
  return {
    login,
    autoLogin,
    logout,
    setCredentials,
    clearCredentials,
  };
}
