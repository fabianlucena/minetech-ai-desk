import { TechnicianMinDTO } from './technician.dto.js';

export class ShiftMinDTO {
  constructor(shift) {
    this.uuid = shift.uuid;
    this.technician = shift.technician ? new TechnicianMinDTO(shift.technician) : null;
    this.startDate = shift.startDate;
    this.endDate = shift.endDate;
  }
}

export class ShiftDTO {
  constructor(shift) {
    this.uuid = shift.uuid;
    this.technician = shift.technician ? new TechnicianMinDTO(shift.technician) : null;
    this.type = shift.type;
    this.startDate = shift.startDate;
    this.endDate = shift.endDate;
    this.createdAt = shift.createdAt;
    this.updatedAt = shift.updatedAt;
    this.deletedAt = shift.deletedAt;
  }
}