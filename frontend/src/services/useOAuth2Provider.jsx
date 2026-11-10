import { useCallback, useMemo } from 'react';
import useApi from './useApi';

function normalizeOAuth2ProviderClient(client) {
  if (!client)
    return null;
  
  return {
    ...client,
  }
}

export default function useOAuth2ProviderClient() {
  const api = useApi();

  const getOAuth2Providers = useCallback(() => api.getJson('v1/oauth2/providers', { normalizeItem: normalizeOAuth2ProviderClient }), [api]);
  const oAuth2Callback = useCallback((name, action, query, options) => api.getJson(`v1/oauth2/callback/${name}/${action}`, { ...options, query }), [api]);

  return useMemo(() => ({
    normalizeOAuth2ProviderClient,
    getOAuth2Providers,
    oAuth2Callback
  }), [getOAuth2Providers, oAuth2Callback]);
}