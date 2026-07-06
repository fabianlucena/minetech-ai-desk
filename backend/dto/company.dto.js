export class CompanyMinDTO {
  constructor(company) {
    this.uuid = company.uuid;
    this.name = company.name;
  }
}

export class CompanyDTO {
  constructor(company) {
    this.uuid = company.uuid;
    this.name = company.name;
    this.description = company.description;
    this.isActive = company.isActive;
    this.createdAt = company.createdAt;
    this.updatedAt = company.updatedAt;
    this.deletedAt = company.deletedAt;
  }
}