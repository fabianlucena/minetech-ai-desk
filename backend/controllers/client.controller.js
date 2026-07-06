import getDependency from '../dependency.js';
import { ClientDTO } from '../dto/client.dto.js';
import { clientStatus } from '../categories/client_status.js';

export async function getList(req, res) {
  const clientService = getDependency('clientService');
  const clients = await clientService.getList({
    includeDeleted: !!req.query.includeDeleted,
    session: req.session,
  });
  res.json(clients.map(u => new ClientDTO(u)));
}

export async function getByUuid(req, res) {
  const clientService = getDependency('clientService');
  const client = await clientService.getByUuid(req.params.uuid, {
    session: req.session,
  });
  res.json(new ClientDTO(client));
}

export async function create(req, res) {
  const clientService = getDependency('clientService');
  const client = await clientService.create(
    req.body,
    { session: req.session }
  );
  res.json(new ClientDTO(client));
}

export async function updateByUuid(req, res) {
  const clientService = getDependency('clientService');
  const client = await clientService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new ClientDTO(client));
}

export async function deleteByUuid(req, res) {
  const clientService = getDependency('clientService');
  await clientService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function restoreByUuid(req, res) {
  const clientService = getDependency('clientService');
  await clientService.restoreByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function getStatus(req, res) {
  res.json(clientStatus);
}