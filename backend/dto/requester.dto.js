import { ClientMinDTO } from './client.dto.js';
import { UserMinDTO } from './user.dto.js';

export class RequesterMinDTO {
  constructor(requester) {
    this.uuid = requester.uuid;
    this.displayName = requester.displayName;
    this.bannedAt = requester.bannedAt;
  }
}

export class RequesterDTO {
  constructor(requester) {
    this.uuid = requester.uuid;
    this.displayName = requester.displayName;
    this.phone = requester.phone;
    this.email = requester.email;
    this.createdAt = requester.createdAt;
    this.updatedAt = requester.updatedAt;
    this.deletedAt = requester.deletedAt;
    this.client = requester.client ? new ClientMinDTO(requester.client) : null;
    this.bannedAt = requester.bannedAt;
    this.bannedBy = requester.bannedBy ? new UserMinDTO(requester.bannedBy) : null;
    this.banReason = requester.banReason;
  }
}