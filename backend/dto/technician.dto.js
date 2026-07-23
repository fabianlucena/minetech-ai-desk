export class TechnicianMinDTO {
  constructor(technician) {
    this.uuid = technician.uuid;
    this.color = technician.color;
  }
}

export class TechnicianDTO {
  constructor(technician) {
    this.uuid = technician.uuid;
    this.color = technician.color;
    this.phone = technician.phone;
    this.isActive = technician.isActive;
    this.createdAt = technician.createdAt;
    this.updatedAt = technician.updatedAt;
    this.deletedAt = technician.deletedAt;
  }
}

export class TechnicianUserDTO {
  constructor(user) {
    this.uuid = user.uuid;
    this.displayName = user.displayName;
  }
}