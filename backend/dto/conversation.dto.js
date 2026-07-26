import { RequesterMinDTO } from './requester.dto.js';
import { ClientMinDTO } from './client.dto.js';

export class ConversationMinDTO {
  constructor(conversation) {
    this.uuid = conversation.uuid;
    this.requester = conversation.requester.displayName;
    this.client = conversation.client.name;
  }
}

export class ConversationDTO {
  constructor(conversation) {
    this.uuid = conversation.uuid;
    this.requester = conversation.requester ? new RequesterMinDTO(conversation.requester) : null;
    this.client = conversation.client ? new ClientMinDTO(conversation.client) : null;
    this.lastMessageAt = conversation.lastMessageAt;
    this.createdAt = conversation.createdAt;
    this.deletedAt = conversation.deletedAt;
    this.closedAt = conversation.closedAt;
  }
}