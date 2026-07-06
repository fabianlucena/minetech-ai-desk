export class TechnicianMinDTO {
  constructor(technician) {
    this.uuid = technician.uuid;
    this.fullName = technician.fullName;
  }
}

export class TechnicianDTO {
  constructor(technician) {
    this.uuid = technician.uuid;
    this.fullName = technician.fullName;
    this.phone = technician.phone;
    this.isActive = technician.isActive;
    this.createdAt = technician.createdAt;
    this.updatedAt = technician.updatedAt;
    this.deletedAt = technician.deletedAt;
  }
}