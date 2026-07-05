import { RoleMinDTO } from './role.dto.js';

export class UserMinDTO {
  constructor(user) {
    this.uuid = user.uuid;
    this.username = user.username;
    this.displayName = user.displayName;
  }
}

export class UserDTO {
  constructor(user) {
    this.uuid = user.uuid;
    this.username = user.username;
    this.displayName = user.displayName;
    this.isActive = user.isActive;
    this.canLogin = user.canLogin;
    this.hasPassword = !!user.password;
    this.roles = user.roles?.map(role => new RoleMinDTO(role));
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
    this.lastLoginAt = user.lastLoginAt;
  }
}