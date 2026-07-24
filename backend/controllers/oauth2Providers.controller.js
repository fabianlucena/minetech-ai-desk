import getDependency from '../dependency.js';
import { OAuth2ProviderResponse } from '../dto/oauth2Provider.dto.js';

export async function getList(req, res) {
  const oauth2ProviderService = getDependency('oauth2ProviderService');
  const providers = await oauth2ProviderService.getList();
  res.json(providers.map(p => new OAuth2ProviderResponse(p)));
}