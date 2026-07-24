import { getDependency } from '../dependency.js';

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

    var oauth2Service = getDependency('oauth2Service');
    this.url = oauth2Service.getFullUrl(provider, endpoint);
  }
}