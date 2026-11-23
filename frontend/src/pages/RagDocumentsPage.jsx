import { useCallback, useEffect, useState } from 'react';
import useToast from '../contexts/useToast';
import usePermissions from '../contexts/usePermissions';
import useDataNotifications from '../services/useDataNotifications';
import useRagDocument from '../services/useRagDocument';
import Objects from '../components/Objects';
import SwitchField from '../components/fields/SwitchField.jsx';
import { Typography, Box } from '@mui/material';
import { DocumentIcon } from '../components/icons/index.jsx';
import Chip from '../components/Chip.jsx';
import { UploadButton } from '../components/buttons/index.jsx';
import { useNavigate } from 'react-router-dom';

function sizeInMB(size) {
  if (size < 1000)
    return size + ' B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(1000));
  return (size / Math.pow(1000, i)).toFixed(2) + ' ' + units[i];
}

export default function RagDocumentsPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const { addMessage, addError } = useToast();
  const { subscribe } = useDataNotifications();
  const { getRagDocuments, deleteRagDocument, restoreRagDocument, getRagDocumentsStatus } = useRagDocument();
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [status, setStatus] = useState({});

  const getStatusNameByValue = useCallback((value) => {
    return status.find(s => s.value === value)?.name ?? value;
  }, [status]);

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

  const loadStatuses = useCallback(async () => {
    try {
      setStatus(await getRagDocumentsStatus());
    } catch (error) {
      addError('Error al obtener los estados de los documentos');
      console.error('Error al obtener los estados de los documentos:', error);
    }
  }, [getRagDocumentsStatus, addError]);

  useEffect(() => {
    function reload() {
      load();
    }
    reload();

    loadStatuses();
  }, [load, loadStatuses]);
  
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
    renderItem={(item) => <Box
      onClick={() => hasPermission('ragDocuments.read') && navigate(`/rag-documents/${item.uuid}`)}
      sx={{
        width: 120,
      }}
    >
      <DocumentIcon sx={{ fontSize: 52, color: '#4040a0' }} />
      <Typography variant="subtitle1" fontWeight="medium" color="text.primary">
        {item.fileName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {sizeInMB(item.fileSize)}
      </Typography>
      <Chip label={getStatusNameByValue(item.status) || 'Desconocido'} />
    </Box>}
    paginationMode="server"
    paginationModel={paginationModel}
    onPaginationModelChange={(...args) => { setRows([]); setPaginationModel(...args); }}
    pageSizeOptions={[10, 20, 50, 100]}
    onReload={() => load()}
    onDelete={hasPermission('ragDocuments.delete') && deleteRagDocumentHandler}
    editPath={hasPermission('ragDocuments.update') && '/rag-documents/:uuid/edit'}
    onRestore={hasPermission('ragDocuments.restore') && restoreRagDocumentHandler}
    clickItemPath={hasPermission('ragDocuments.show') && '/rag-documents/:uuid'}
    tools={<>
      {hasPermission('ragDocuments.restore') && 
        <SwitchField
          label='Incluir eliminados'
          checked={includeDeleted}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
        />
      }
      {hasPermission('ragDocuments.create') &&
        <UploadButton onClick={() => navigate('/rag-documents/new')} />
      }
    </>}
  />;
}