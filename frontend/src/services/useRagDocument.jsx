import { useCallback, useMemo } from 'react';
import useApi from './useApi';

function normalizeRagDocument(item) {
  if (!item)
    return null;

  return {
    ...item,
    createdAt: item.createdAt && new Date(item.createdAt),
    updatedAt: item.updatedAt && new Date(item.updatedAt),
    deletedAt: item.deletedAt && new Date(item.deletedAt),
  }
}

export default function useRagDocument() {
  const api = useApi();

  const getRagDocuments = useCallback((params) => api.getJson('v1/rag-documents', { normalizeItem: normalizeRagDocument, ...params }), [api]);
  const getRagDocument = useCallback((uuid, params) => api.getJson(`v1/rag-documents/${uuid}`, { normalizeItem: normalizeRagDocument, ...params }), [api]);
  const createRagDocument = useCallback((data) => api.postJson('v1/rag-documents', { normalizeItem: normalizeRagDocument, body: data }), [api]);
  const updateRagDocument = useCallback((uuid, data) => api.putJson(`v1/rag-documents/${uuid}`, { normalizeItem: normalizeRagDocument, body: data }), [api]);
  const deleteRagDocument = useCallback((uuid) => api.deleteJson(`v1/rag-documents/${uuid}`), [api]);
  const restoreRagDocument = useCallback((uuid) => api.patchJson(`v1/rag-documents/${uuid}/restore`), [api]);

  return useMemo(() => ({
    normalizeRagDocument,
    getRagDocuments,
    getRagDocument,
    createRagDocument,
    updateRagDocument,
    deleteRagDocument,
    restoreRagDocument,
  }), [getRagDocuments, getRagDocument, createRagDocument, updateRagDocument, deleteRagDocument, restoreRagDocument]);
}