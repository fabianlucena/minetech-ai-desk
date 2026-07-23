export class OAuth2ProviderResponse {
  constructor(provider) {
    if (!provider)
      throw new Exception('No hay proveedor.');

    if (!provider.name)
      throw new Exception('El proveedor no tiene un nombre.');

    if (!provider.isEnabled)
      throw new Exception('El proveedor no está habilitado.');

    const endpoint = provider.endpoints?.authorize;
    if (!endpoint)
      throw new Exception(`El proveedor ${provider.name} no tiene un endpoint de autorización.`);
    
    this.name = provider.name;
    this.displayName = provider.displayName || `Ingresar con ${provider.name}`;
    this.url = (provider.client.urlBase || '' ) + endpoint.url;

    const parameters = new Map();
    
    if (endpoint.includeClientId !== false)
      parameters.set('client_id', provider.client.clientId);
      
    if (endpoint.includeRedirectUri !== false)
      parameters.set('redirect_uri', provider.client.redirectUri);

    if (endpoint.parameters) {
      for (const [key, value] of Object.entries(endpoint.parameters)) {
        parameters.set(key, value);
      }
    }
    
    if (parameters.size) {
        this.url += this.url.includes('?') ? '&' : '?';
        this.url += [...parameters.entries()]
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&');
    }
  }
}