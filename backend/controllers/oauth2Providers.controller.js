import getDependency from '../dependency.js';
import { OAuth2ProviderResponse } from '../dto/oauth2Provider.dto.js';

export async function getList(req, res) {
  const oauth2ProviderService = getDependency('oauth2ProviderService');
  const users = await oauth2ProviderService.getList();
  res.json(users.map(u => new OAuth2ProviderResponse(u)));
}