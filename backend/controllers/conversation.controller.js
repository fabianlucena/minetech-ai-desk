import getDependency from '../dependency.js';
import { RequesterDTO } from '../dto/requester.dto.js';

export async function getList(req, res) {
  const requesterService = getDependency('requesterService');
  const requesters = await requesterService.getList({
    includeDeleted: !!req.query.includeDeleted,
    includeClient: true,
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