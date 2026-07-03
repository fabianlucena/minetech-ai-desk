export class SessionResponse {
  constructor(session) {
    this.authorizationToken = session.authorizationToken;
    this.autoLoginToken = session.autoLoginToken;
  }

  /*{
        device: device.token,
        user: new UserMinDTO(user),
        role: session.role,
      }; */
}