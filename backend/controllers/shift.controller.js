import getDependency from '../dependency.js';
import { ShiftDTO } from '../dto/shift.dto.js';
import { TechnicianMinDTO } from '../dto/technician.dto.js';
import { shiftTypes } from '../categories/shift_types.js';

export async function getList(req, res) {
  const shiftService = getDependency('shiftService');
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
  
  const shifts = await shiftService.getList(options);
  res.json(shifts.map(s => new ShiftDTO(s)));
}

export async function getByUuid(req, res) {
  const shiftService = getDependency('shiftService');
  const shift = await shiftService.getByUuid(req.params.uuid, {
    includeTechnician: true,
    session: req.session,
  });
  res.json(new ShiftDTO(shift));
}

export async function getTechnicians(req, res) {
  const technicianService = getDependency('technicianService');
  const technicians = await technicianService.getList({
    includeUser: true,
    session: req.session,
  });
  res.json(technicians.map(t => new TechnicianMinDTO(t)));
}

export async function getTypes(req, res) {
  res.json(shiftTypes);
}

export async function create(req, res) {
  const shiftService = getDependency('shiftService');
  const shift = await shiftService.create(
    req.body,
    { session: req.session }
  );
  res.json(new ShiftDTO(shift));
}

export async function updateByUuid(req, res) {
  const shiftService = getDependency('shiftService');
  const shift = await shiftService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new ShiftDTO(shift));
}

export async function deleteByUuid(req, res) {
  const shiftService = getDependency('shiftService');
  await shiftService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function restoreByUuid(req, res) {
  const shiftService = getDependency('shiftService');
  await shiftService.restoreByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}