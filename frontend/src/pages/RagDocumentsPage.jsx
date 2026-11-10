import { useCallback, useEffect, useState } from 'react';
import useToast from '../contexts/useToast';
import usePermissions from '../contexts/usePermissions';
import useDataNotifications from '../services/useDataNotifications';
import useRagDocument from '../services/useRagDocument';
import Objects from '../components/Objects';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function RagDocumentsPage() {
  const { hasPermission } = usePermissions();
  const { addMessage, addError } = useToast();
  const { subscribe } = useDataNotifications();
  const { getRagDocuments, deleteRagDocument, restoreRagDocument } = useRagDocument();
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);

  const load = useCallback(async () => {
    try {
      const query = { ...paginationModel, includeCount: true };
      if (includeDeleted) {
        query.includeDeleted = 1;
      }

      const res = await getRagDocuments({ query });
      setItems(res.rows);
      setItemCount(res.itemCount ?? res.rows.length);
    } catch (error) {
      addError('Error al obtener los documentos');
      console.error('Error al obtener los documentos:', error);
    }
  }, [addError, includeDeleted, getRagDocuments, paginationModel]);

  useEffect(() => {
    function reload() {
      load();
    }
    reload();
  }, [load]);
  
  useEffect(() => subscribe('ragDocuments', load), [subscribe, load]);

  const deleteRagDocumentHandler = useCallback(async ({ uuid }) => {
    try {
      await deleteRagDocument(uuid);
      addMessage('Documento eliminado correctamente');
      load();
    } catch (error) {
      addError('Error al eliminar el documento');
      console.error('Error al eliminar el documento:', error);
    }
  }, [deleteRagDocument, addMessage, addError, load]);

  const restoreRagDocumentHandler = useCallback(async ({ uuid }) => {
    try {
      await restoreRagDocument(uuid);
      addMessage('Documento restaurado correctamente');
      load();
    } catch (error) {
      addError('Error al restaurar el documento');
      console.error('Error al restaurar el documento:', error);
    }
  }, [restoreRagDocument, addMessage, addError, load]);

  return <Objects
    title="Documentos RAG"
    items={items}
    itemCount={itemCount}
    paginationMode="server"
    paginationModel={paginationModel}
    onPaginationModelChange={(...args) => { setRows([]); setPaginationModel(...args); }}
    pageSizeOptions={[10, 20, 50, 100]}
    onReload={() => load()}
    createPath={hasPermission('ragDocuments.create') && '/rag-documents/new'}
    onDelete={hasPermission('ragDocuments.delete') && deleteRagDocumentHandler}
    editPath={hasPermission('ragDocuments.update') && '/rag-documents/:uuid/edit'}
    onRestore={hasPermission('ragDocuments.restore') && restoreRagDocumentHandler}
    tools={<>
      {hasPermission('ragDocuments.restore') && 
        <SwitchField
          label='Incluir eliminados'
          checked={includeDeleted}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
        />
      }
    </>}
  />;
}