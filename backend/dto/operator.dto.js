import { ClientMinDTO } from './client.dto.js';

export class OperatorMinDTO {
  constructor(operator) {
    this.uuid = operator.uuid;
    this.fullName = operator.fullName;
  }
}

export class OperatorDTO {
  constructor(operator) {
    this.uuid = operator.uuid;
    this.fullName = operator.fullName;
    this.phone = operator.phone;
    this.email = operator.email;
    this.isActive = operator.isActive;
    this.createdAt = operator.createdAt;
    this.updatedAt = operator.updatedAt;
    this.deletedAt = operator.deletedAt;
    this.client = operator.client ? new ClientMinDTO(operator.client) : null;
  }
}