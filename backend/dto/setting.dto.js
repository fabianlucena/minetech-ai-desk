export class SettingMinDTO {
  constructor(setting) {
    this.uuid = setting.uuid;
    this.key = setting.key;
    this.value = setting.value;
  }
}

export class SettingDTO {
  constructor(setting) {
    this.uuid = setting.uuid;
    this.key = setting.key;
    this.value = setting.value;
    this.description = setting.description;
    this.createdAt = setting.createdAt;
    this.updatedAt = setting.updatedAt;
    this.deletedAt = setting.deletedAt;
  }
}