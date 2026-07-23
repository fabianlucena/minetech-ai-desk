import { getDependency } from '../dependency.js';

export default class OAuth2Service {
  constructor() {
  }

  getFullUrl(provider, endpoint) {
    if (!provider || !endpoint) {
      throw new Error('Se requieren el proveedor y el endpoint para obtener la URL completa.');
    }

    const base = provider.client.urlBase || '';
    const url = new URL(base + endpoint.url);

    const params = new URLSearchParams();

    if (endpoint.includeClientId !== false)
      params.set('client_id', provider.client.clientId);

    if (endpoint.includeRedirectUri !== false)
      params.set('redirect_uri', provider.client.redirectUri);

    if (endpoint.parameters) {
      for (const [key, value] of Object.entries(endpoint.parameters)) {
        params.set(key, value);
      }
    }

    url.search = params.toString();

    return url.toString();
  }

  async callback({ provider, action, data, options }) {
    if (!provider)
      throw new Error('No hay parámetro de proveedor.');

    if (!action)
      throw new Error('No hay parámetro de acción.');

    const oauth2ProviderService = getDependency('oauth2ProviderService');
    provider = await oauth2ProviderService.getSingleByName(provider);

    if (action === 'authorize')
      return await this.callbackAuthorize(provider, data, options);
  
    throw new Error(`Acción no soportada para el proveedor ${provider.name}.`);
  }

  async callbackAuthorize(provider, data, options) {
    if (!data?.code)
      throw new Error('No hay parámetro de código.');

    const token = await this.getToken(provider, data.code);
    if (!token)
        throw new Error('No se recibió un token de acceso.');

    const userInfo = await this.getUserInfo(provider, token);
    if (!userInfo)
        throw new Error('No se recibió información del usuario.');

    const userService = getDependency('userService');
    const username = userInfo.preferredUsername || userInfo.username || userInfo.email || userInfo.name || userInfo.sub;
    let userId = await userService.getIdByUsername(username);

    if (!userId) {
      userId = await userService.getIdByEmail(userInfo.email);
      if (!userId) {
        if (!provider.features?.allowSelfRegistration
          || !provider.features.selfRegistrationAllowedDomains.includes('@' + userInfo.email.split('@')[1])
        )
          throw new Error('Usuario no registrado.');

        var user = await this.registerUser(userInfo, username);
        userId = user.id;
      }
    }

    const deviceService = getDependency('deviceService');
    const sessionService = getDependency('sessionService');

    const deviceId = await deviceService.getIdOrCreateByToken(data?.deviceToken || '');
    
    let session = await sessionService.create({
      userId,
      deviceId,
      data: {
        service: 'oauth2',
        identityProvider: provider.name
      },
    }, options);

    session = await sessionService.decorateWithCredentials(session);
    
    return session;
  }

  async getToken(provider, code) {
    if (provider == null)
        throw new Error('No se ha proporcionado un proveedor válido.');

    if (!code)
        throw new Error('No se ha proporcionado un código de autorización.');

    const tokenEndpoint = provider.endpoints?.token;
    if (!tokenEndpoint)
        throw new Error(`El proveedor ${provider.name} no tiene un endpoint de token configurado.`);
    
    const tokenUrl = this.getFullUrl(provider, tokenEndpoint);
    if (!tokenUrl)
        throw new Error(`El proveedor ${provider.name} no tiene una URL de token configurada.`);

    const redirectUri = provider.client.redirectUri;
    if (!redirectUri)
      throw new Error(`No se ha proporcionado un URI de redirección para  el endpoint token del proveedor ${provider.name}.`);

    let body = new URLSearchParams({
        client_id: provider.client.clientId,
        client_secret: provider.client.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
    });

    const res = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body,
    });

    let data;
    try
    {
      data = await res.json();
      if (data.access_token)
        return data.access_token;
    } catch {}

    let message = data;
    if (typeof data === 'object') {
      message = message.error_description
        ?? message.error_reason
        ?? message.error;
    }

    if (!message)
      message = `No se pudo obtener el token de acceso del proveedor ${provider.name}.`;

    throw new Error('Error al obtener el token de acceso: ' + message);
  }

  async getUserInfo(provider, accessToken) {
    const userInfoEndpoint = provider.endpoints?.userInfo;
    if (!userInfoEndpoint)
      throw new Error(`No se encontró un endpoint de información de usuario en el proveedor ${provider.name}.`);

    return await this.getJson(provider, userInfoEndpoint, accessToken);
  }
  
  async get(provider, endpoint,  accessToken) {
    if (!provider || !accessToken) {
      throw new Error('Se requieren el proveedor y el token de acceso para obtener la información del usuario.');
    }

    var url = this.getFullUrl(provider, endpoint);
    if (!url)
        throw new Error(`No se pudo obtener la URL de información del usuario para el proveedor ${provider.name}.`);

    var res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return res;
  }

  async getJson(provider, endpoint, accessToken) {
    try {
      const res = await this.get(provider, endpoint, accessToken);
      return await res.json();
    } catch (err) {
      throw new Error(`Error al obtener la información del proveedor ${provider.name}: ${err.message}`);
    }
  }

  async registerUser(userInfo, username) {
    const userService = getDependency('userService');
    const displayName = userInfo.fullName || userInfo.name || `${userInfo.givenName} ${userInfo.familyName}`.trim();
    var user = await userService.create({
      username,
      displayName,
      email: userInfo.email,
    });

    return user;
  }
}