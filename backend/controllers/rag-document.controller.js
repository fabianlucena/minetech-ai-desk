import getDependency from '../dependency.js';
import { getOptionsFromRequest } from './utils.js';
import { Error400 } from '../errors/error400.js';
import { RagDocumentDTO } from '../dto/ragDocument.dto.js';

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
  
  res.json(rows.map(d => new RagDocumentDTO(d)));
}

export async function getByUuid(req, res) {
  const ragDocumentService = getDependency('ragDocumentService');
  const document = await ragDocumentService.getByUuid(req.params.uuid, {
    session: req.session,
  });
  res.json(new RagDocumentDTO(document));
}

export async function create(req, res) {
  if (!req.files?.length)
    throw new Error400('No se ha subido ningún archivo');
  
  const ragDocumentService = getDependency('ragDocumentService');
  
  const ragDocuments = [];
  for (const file of req.files) {
    const ragDocument = await ragDocumentService.create(
      {
        ...req.body,
        file,
      },
      { session: req.session }
    );
    ragDocuments.push(ragDocument);
  }

  res.json(ragDocuments.map(ragDocument => new RagDocumentDTO(ragDocument)));
}

export async function updateByUuid(req, res) {
  const ragDocumentService = getDependency('ragDocumentService');
  const document = await ragDocumentService.updateByUuid(
    req.params.uuid,
    req.body,
    { session: req.session }
  );
  res.json(new RagDocumentDTO(document));
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