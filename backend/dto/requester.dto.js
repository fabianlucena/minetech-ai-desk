import { ClientMinDTO } from './client.dto.js';

export class RequesterMinDTO {
  constructor(requester) {
    this.uuid = requester.uuid;
    this.fullName = requester.fullName;
  }
}

export class RequesterDTO {
  constructor(requester) {
    this.uuid = requester.uuid;
    this.fullName = requester.fullName;
    this.phone = requester.phone;
    this.email = requester.email;
    this.isActive = requester.isActive;
    this.createdAt = requester.createdAt;
    this.updatedAt = requester.updatedAt;
    this.deletedAt = requester.deletedAt;
    this.client = requester.client ? new ClientMinDTO(requester.client) : null;
  }
}