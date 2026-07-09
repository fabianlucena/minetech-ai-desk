import { RoleMinDTO } from './role.dto.js';

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
  }
}