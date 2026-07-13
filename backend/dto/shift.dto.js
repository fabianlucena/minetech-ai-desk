import { TechnicianMinDTO } from './technician.dto.js';

export class ShiftMinDTO {
  constructor(shift) {
    this.uuid = shift.uuid;
    this.technician = shift.technician ? new TechnicianMinDTO(shift.technician) : null;
    this.start = shift.start;
    this.end = shift.end;
  }
}

export class ShiftDTO {
  constructor(shift) {
    this.uuid = shift.uuid;
    this.technician = shift.technician ? new TechnicianMinDTO(shift.technician) : null;
    this.type = shift.type;
    this.start = shift.start;
    this.end = shift.end;
    this.createdAt = shift.createdAt;
    this.updatedAt = shift.updatedAt;
    this.deletedAt = shift.deletedAt;
  }
}