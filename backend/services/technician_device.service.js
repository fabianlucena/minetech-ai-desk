import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class TechnicianDeviceService extends ModelService {
  constructor() {
    super({
      model: getDependency('technicianDeviceModel'),
      isActivable: true,
    });
  }

  get validPropertiesForCreation() {
    return ['token', 'type', 'isActive', 'technicianId', 'deviceId'];
  }

  get validPropertiesForUpdate() {
    return ['token', 'type', 'isActive'];
  }

  async register(data) {
    if (!data.token)
      throw new Error('El token de notificación push es obligatorio');

    if (!data.type)
      throw new Error('El tipo de token de notificación push es obligatorio');

    if (!data.technicianId)
      throw new Error('El ID de técnico es obligatorio');

    if (!data.deviceId)
      throw new Error('El ID de dispositivo es obligatorio');

    let usedToken = await this.getFirstOrDefault({ includeInactive: true, where: { token: data.token } })
    if (usedToken && (usedToken.technicianId !== data.technicianId || usedToken.deviceId !== data.deviceId)) {
      throw new Error('El token de notificación push ya está registrado para otro técnico o dispositivo');
    }

    let device = await this.getFirstOrDefault({ includeInactive: true, where: { technicianId: data.technicianId, deviceId: data.deviceId } })
    if (device) {
      if (device.token !== data.token || device.type !== data.type || !device.isActive) {
        device = await this.updateById(
          device.id,
          {
            isActive: true,
            token: data.token,
            type: data.type,
          },
          { includeInactive: true }
        );
      }
    } else {
      device = await this.create({ isActive: true, ...data });
    }

    return device;
  }

  async deactivateById(id) {
    return await this.updateById(id, { isActive: false });
  }

  async getByTechnicianId(technicianId, options) {
    if (!technicianId)
      throw new Error('El ID de técnico es obligatorio');

    return await this.getList({ ...options, where: { technicianId } });
  }
}