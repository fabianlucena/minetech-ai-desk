import getDependency from '../dependency.js';

export async function callback(req, res) {
  const oauth2Service = getDependency('oauth2Service');
  await oauth2Service.callback(req.params.provider, req.params.action, req.query, req);

  res.send('OAuth2 callback endpoint');
}