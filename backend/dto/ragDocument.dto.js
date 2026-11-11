export class RagDocumentMinDTO {
  constructor(client) {
    this.uuid = client.uuid;
    this.fileName = client.fileName;
  }
}

export class RagDocumentDTO {
  constructor(client) {
    this.uuid = client.uuid;
    this.isActive = client.isActive;
    this.fileName = client.fileName;
    this.mimeType = client.mimeType;
    this.fileSize = client.fileSize;
    this.checksum = client.checksum;
    this.status = client.status;
    this.createdAt = client.createdAt;
    this.updatedAt = client.updatedAt;
    this.deletedAt = client.deletedAt;
  }
}