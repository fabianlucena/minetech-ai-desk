import { useCallback, useMemo } from 'react';
import useApi from './useApi';

export default function useLogin() {
  const api = useApi();

  const setCredentials = useCallback((data) => {
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
  }, [api]);

  const clearCredentials = useCallback(async () => {
    localStorage.removeItem('autoLoginToken');
    api.setAuthorizationToken(null);
    api.setAutorization(null);
    api.setAuthorizationExpireAt(null);
  }, [api]);

  const _login = useCallback(async (service, body, options) => {
    var res = await api.postJson(service, { ...options, body });
    await setCredentials(res);
    return res;
  }, [setCredentials, api]);

  const login = useCallback(async (data, options) => {
    return _login(
      'v1/login',
      {
        ...data,
        deviceToken: localStorage.getItem('deviceToken'),
      },
      options
    );
  }, [_login]);

  const autoLogin = useCallback(async (options) => {
    const body = {
      autoLoginToken: localStorage.getItem('autoLoginToken'),
      deviceToken: localStorage.getItem('deviceToken'),
    };

    if (body.autoLoginToken && body.deviceToken)
      return _login('v1/auto-login', body, options);
  }, [_login]);

  const logout = useCallback(async (options) => {
    options = {
      authorization: api.authorization,
      ...options,
    };

    clearCredentials();
    localStorage.removeItem('autoLoginToken');
    await api.getJson('v1/logout', options);
  }, [api, clearCredentials]);

  return useMemo(() => ({
    login,
    autoLogin,
    logout,
    setCredentials,
    clearCredentials,
  }), [autoLogin, clearCredentials, login, logout, setCredentials]);
}
