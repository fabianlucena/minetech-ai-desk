import { useCallback, useMemo } from 'react';
import asyncStorage from '@react-native-async-storage/async-storage';
import useApi from './useApi';

export default function useLoginService() {
  const api = useApi();

  const login = useCallback(async (data, options) => {
    return _login(
      'v1/login',
      {
        ...data,
        deviceToken: await asyncStorage.getItem('deviceToken'),
      },
      options
    );
  }, [api]);

  const canAutoLogin = useCallback(async () => {
    const autoLoginToken = await asyncStorage.getItem('autoLoginToken');
    const deviceToken = await asyncStorage.getItem('deviceToken');
    return !!autoLoginToken && !!deviceToken;
  }, []);

  const autoLogin = useCallback(async (options) => {
    const body = {
      autoLoginToken: await asyncStorage.getItem('autoLoginToken'),
      deviceToken: await asyncStorage.getItem('deviceToken'),
    };

    if (body.autoLoginToken && body.deviceToken)
      return _login('v1/auto-login', body, options);
  }, []);

  const _login = useCallback(async (service, body, options) => {
    var res = await api.postJson(service, { ...options, body });
    await setCredentials(res);
    return res;
  }, [api]);

  const logout = useCallback(async (options) => {
    options = {
      authorization: api.authorization,
      ...options,
    };

    clearCredentials();
    await asyncStorage.removeItem('autoLoginToken');
    await api.getJson('v1/logout', options);
  }, [api]);

  const setCredentials = useCallback(async (data) => {
    if (data.authorizationToken) {
      api.setAuthorizationToken(data.authorizationToken);
      api.setAutorization('Bearer ' + data.authorizationToken);
      if (data.expireAt) {
        api.setAuthorizationExpireAt(new Date(data.expireAt));
      }
    }

    if (data.deviceToken) {
      await asyncStorage.setItem('deviceToken', data.deviceToken);
    }

    if (data.autoLoginToken) {
      await asyncStorage.setItem('autoLoginToken', data.autoLoginToken);
    } else {
      await asyncStorage.removeItem('autoLoginToken');
    }

    return data;
  }, [api]);

  const clearCredentials = useCallback(async () => {
    await asyncStorage.removeItem('autoLoginToken');
    api.setAuthorizationToken(null);
    api.setAutorization(null);
    api.setAuthorizationExpireAt(null);
  }, [api]);

  return useMemo(() => ({
    login,
    canAutoLogin,
    autoLogin,
    logout,
    setCredentials,
    clearCredentials,
  }), [login, canAutoLogin, autoLogin, logout, setCredentials, clearCredentials]);
}
