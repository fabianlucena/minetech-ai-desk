export class ClientMinDTO {
  constructor(client) {
    this.uuid = client.uuid;
    this.name = client.name;
  }
}

export class ClientDTO {
  constructor(client) {
    this.uuid = client.uuid;
    this.name = client.name;
    this.clientCode = client.clientCode;
    this.token = client.token;
    this.isActive = client.isActive;
    this.status = client.status;
    this.createdAt = client.createdAt;
    this.updatedAt = client.updatedAt;
    this.deletedAt = client.deletedAt;
  }
}