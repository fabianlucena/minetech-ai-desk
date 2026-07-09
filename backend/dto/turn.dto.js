export class TurnMinDTO {
  constructor(turn) {
    this.uuid = turn.uuid;
    this.technician = turn.technician ? new TechnicianMinDTO(turn.technician) : null;
    this.startDate = turn.startDate;
    this.endDate = turn.endDate;
  }
}

export class TurnDTO {
  constructor(turn) {
    this.uuid = turn.uuid;
    this.technician = turn.technician ? new TechnicianMinDTO(turn.technician) : null;
    this.type = turn.type;
    this.startDate = turn.startDate;
    this.endDate = turn.endDate;
    this.createdAt = turn.createdAt;
    this.updatedAt = turn.updatedAt;
    this.deletedAt = turn.deletedAt;
  }
}