import getDependency from '../dependency.js';
import { RequesterDTO } from '../dto/requester.dto.js';

export async function getList(req, res) {
  const requesterService = getDependency('requesterService');
  const requesters = await requesterService.getList({
    includeDeleted: !!req.query.includeDeleted,
    session: req.session,
  });
  res.json(requesters.map(u => new RequesterDTO(u)));
}

export async function getByUuid(req, res) {
  const requesterService = getDependency('requesterService');
  const requester = await requesterService.getByUuid(req.params.uuid, {
    session: req.session,
  });
  res.json(new RequesterDTO(requester));
}

export async function create(req, res) {
  const requesterService = getDependency('requesterService');
  const requester = await requesterService.create(
    req.body,
    { session: req.session }
  );
  res.json(new RequesterDTO(requester));
}

export async function updateByUuid(req, res) {
  const requesterService = getDependency('requesterService');
  const requester = await requesterService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new RequesterDTO(requester));
}

export async function deleteByUuid(req, res) {
  const requesterService = getDependency('requesterService');
  await requesterService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function restoreByUuid(req, res) {
  const requesterService = getDependency('requesterService');
  await requesterService.restoreByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}