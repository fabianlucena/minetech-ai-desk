import getDependency from '../dependency.js';
import { getOptionsFromRequest } from './utils.js';

export async function getList(req, res) {
  const ragDocumentService = getDependency('ragDocumentService');
  const rows = await ragDocumentService.getList({
    ...getOptionsFromRequest(req),
  });

  if (req.query.includeCount) {
    const count = await ragDocumentService.getCount({
      includeDeleted: !!req.query.includeDeleted,
      session: req.session,
    });
    res.set('X-Total-Count', count.toString());
  }
  
  res.json(rows.map(u => new UserDTO(u)));
}

export async function getByUuid(req, res) {
  const ragDocumentService = getDependency('ragDocumentService');
  const user = await ragDocumentService.getByUuid(req.params.uuid, {
    session: req.session,
  });
  res.json(new UserDTO(user));
}

export async function create(req, res) {
  const ragDocumentService = getDependency('ragDocumentService');
  const user = await ragDocumentService.create(
    req.body,
    { session: req.session }
  );
  res.json(new UserDTO(user));
}

export async function updateByUuid(req, res) {
  const ragDocumentService = getDependency('ragDocumentService');
  const user = await ragDocumentService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new UserDTO(user));
}

export async function deleteByUuid(req, res) {
  const ragDocumentService = getDependency('ragDocumentService');
  await ragDocumentService.deleteByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}

export async function restoreByUuid(req, res) {
  const ragDocumentService = getDependency('ragDocumentService');
  await ragDocumentService.restoreByUuid(
    req.params.uuid,
    { session: req.session }
  );
  res.status(204).end();
}