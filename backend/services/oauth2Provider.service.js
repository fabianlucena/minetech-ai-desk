export default class OAuth2ProviderService {
  constructor() {
  }

  getList() {
    return [
      { name: 'Google' },
      { name: 'Facebook' },
      { name: 'GitHub' },
      { name: 'Twitter' },
    ];
  }
}