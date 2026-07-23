import { getDependency } from '../dependency.js';

export default class OAuth2ProviderService {
  constructor() {
  }

  getList() {
    const config = getDependency('config');
    const providers = [];
    for (var name in config.oAuth2Providers) {
      providers.push({ name, ...config.oAuth2Providers[name] });
    }

    return providers;
  }
  
  getFirstOrDefaultByName(name) {
    const config = getDependency('config');
    const providerConfig = config.oAuth2Providers[name];
    if (!providerConfig) {
      return null;
    }
    
    return { name, ...providerConfig };
  }
}