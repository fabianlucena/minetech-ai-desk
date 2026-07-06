import getDependency from '../dependency.js';
import { TechnicianDTO } from '../dto/technician.dto.js';

export async function getList(req, res) {
  const technicianService = getDependency('technicianService');
  const technicians = await technicianService.getList({
    includeDeleted: !!req.query.includeDeleted,
    session: req.session,
  });
  res.json(technicians.map(u => new TechnicianDTO(u)));
}

export async function getByUuid(req, res) {
  const technicianService = getDependency('technicianService');
  const technician = await technicianService.getByUuid(req.params.uuid, {
    session: req.session,
  });
  res.json(new TechnicianDTO(technician));
}

export async function create(req, res) {
  const technicianService = getDependency('technicianService');
  const technician = await technicianService.create(
    req.body,
    { session: req.session }
  );
  res.json(new TechnicianDTO(technician));
}

export async function updateByUuid(req, res) {
  const technicianService = getDependency('technicianService');
  const technician = await technicianService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new TechnicianDTO(technician));
}

export async function deleteByUuid(req, res) {
  const technicianService = getDependency('technicianService');
  await technicianService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function restoreByUuid(req, res) {
  const technicianService = getDependency('technicianService');
  await technicianService.restoreByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}