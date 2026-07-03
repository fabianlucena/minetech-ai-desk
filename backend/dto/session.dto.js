import { UserMinDTO } from './user.dto.js';

export class SessionResponse {
  constructor(session) {
    this.authorizationToken = session.authorizationToken;
    this.autoLoginToken = session.autoLoginToken;
    this.device = session.device.token;
    this.user = new UserMinDTO(session.user);
    this.roles = session.roles?.map(r => r.name);
    this.permissions = session.permissions?.map(p => p.name);
  }
}