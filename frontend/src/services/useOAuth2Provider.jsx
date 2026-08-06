import useApi from './useApi';

export default function useOAuth2ProviderClient() {
  const api = useApi();

  function normalizeOAuth2ProviderClient(client) {
    if (!client)
      return null;
    
    return {
      ...client,
    }
  }

  return {
    normalizeOAuth2ProviderClient: normalizeOAuth2ProviderClient,
    getOAuth2Providers: () => api.getJson('v1/oauth2/providers', { normalizeItem: normalizeOAuth2ProviderClient }),
    oAuth2Callback: (name, action, query, options) => api.getJson(`v1/oauth2/callback/${name}/${action}`, { ...options, query }),
  };
}