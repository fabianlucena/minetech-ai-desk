import getDependency from '../dependency.js';
import { SettingDTO } from '../dto/setting.dto.js';

export async function getList(req, res) {
  const settingService = getDependency('settingService');
  const settings = await settingService.getList({
    includeDeleted: !!req.query.includeDeleted,
    session: req.session,
  });
  res.json(settings.map(u => new SettingDTO(u)));
}

export async function getByUuid(req, res) {
  const settingService = getDependency('settingService');
  const setting = await settingService.getByUuid(req.params.uuid, {
    includeRoles: true,
    includePassword: true,
    session: req.session,
  });
  res.json(new SettingDTO(setting));
}

export async function getAsignableRoles(req, res) {
  const roleService = getDependency('roleService');
  const roles = await roleService.getList({
    where: { isAsignable: true },
    session: req.session,
  });
  res.json(roles.map(r => new RoleMinDTO(r)));
}

export async function create(req, res) {
  const settingService = getDependency('settingService');
  const setting = await settingService.create(
    req.body,
    { session: req.session }
  );
  res.json(new SettingDTO(setting));
}

export async function updateByUuid(req, res) {
  const settingService = getDependency('settingService');
  const setting = await settingService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new SettingDTO(setting));
}

export async function deleteByUuid(req, res) {
  const settingService = getDependency('settingService');
  await settingService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}