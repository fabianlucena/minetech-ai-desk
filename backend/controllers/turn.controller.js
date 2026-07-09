import getDependency from '../dependency.js';
import { TurnDTO } from '../dto/turn.dto.js';
import { TechnicianMinDTO } from '../dto/technician.dto.js';
import { turnTypes } from '../categories/turn_types.js';

export async function getList(req, res) {
  const turnService = getDependency('turnService');
  const options = {
    includeTechnician: true,
    includeDeleted: !!req.query.includeDeleted,
    session: req.session,
  };
  if (req.query.fromDay && req.query.toDay) {
    const to = new Date(req.query.toDay);
    to.setDate(to.getDate() + 1);
    options.from = new Date(req.query.fromDay);
    options.to = to;
  }
  
  const turns = await turnService.getList(options);
  res.json(turns.map(u => new TurnDTO(u)));
}

export async function getByUuid(req, res) {
  const turnService = getDependency('turnService');
  const turn = await turnService.getByUuid(req.params.uuid, {
    includeTechnician: true,
    session: req.session,
  });
  res.json(new TurnDTO(turn));
}

export async function getTechnicians(req, res) {
  const technicianService = getDependency('technicianService');
  const technicians = await technicianService.getList({
    session: req.session,
  });
  res.json(technicians.map(t => new TechnicianMinDTO(t)));
}

export async function getTypes(req, res) {
  res.json(turnTypes);
}

export async function create(req, res) {
  const turnService = getDependency('turnService');
  const turn = await turnService.create(
    req.body,
    { session: req.session }
  );
  res.json(new TurnDTO(turn));
}

export async function updateByUuid(req, res) {
  const turnService = getDependency('turnService');
  const turn = await turnService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new TurnDTO(turn));
}

export async function deleteByUuid(req, res) {
  const turnService = getDependency('turnService');
  await turnService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function restoreByUuid(req, res) {
  const turnService = getDependency('turnService');
  await turnService.restoreByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}