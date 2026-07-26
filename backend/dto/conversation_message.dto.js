import { RequesterMinDTO } from './requester.dto.js';
import { TechnicianMinDTO } from './technician.dto.js';

export class ConversationMessageDTO {
  constructor(message) {
    this.uuid = message.uuid;

    this.conversation = message.conversation;
    this.receivedAt = message.receivedAt;
    this.senderType = message.senderType;

    this.text = message.text;
    this.media = message.media;

    this.receiverType = message.receiverType;
    this.sentAt = message.sentAt;
    
    this.deletedAt = message.deletedAt;

    if (message.sender) {
      if (message.senderType === 'requester') {
        this.sender = new RequesterMinDTO(message.sender);
      } else if (message.senderType === 'technician') {
        this.sender = new TechnicianMinDTO(message.sender);
      }
    }

    if (message.receiver) {
      if (message.receiverType === 'requester') {
        this.receiver = new RequesterMinDTO(message.receiver);
      } else if (message.receiverType === 'technician') {
        this.receiver = new TechnicianMinDTO(message.receiver);
      }
    }
  }
}