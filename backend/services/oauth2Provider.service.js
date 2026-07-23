import { getDependency } from '../dependency.js';

export default class OAuth2ProviderService {
  constructor() {
  }

  async getList() {
    const config = getDependency('config');
    const providers = [];
    for (var name in config.oAuth2Providers) {
      providers.push({ name, ...config.oAuth2Providers[name] });
    }

    return providers;
  }
  
  async getFirstOrDefaultByName(name) {
    const config = getDependency('config');
    const providerConfig = config.oAuth2Providers[name];
    if (!providerConfig) {
      return null;
    }
    
    return { name, ...providerConfig };
  }

  async getSingleByName(name) {
    const provider = await this.getFirstOrDefaultByName(name);
    if (!provider)
      throw new Error(`Proveedor ${name} no encontrado.`);

    return provider;
  }
}