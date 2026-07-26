import { useState, useEffect, useMemo, useCallback } from 'react';
import Grid from '../components/Grid.jsx';
import useToast from '../states/useToast.jsx';
import usePermissions from '../states/usePermissions.jsx';
import { formatDate } from '../utils/date.js';
import { getConversations, deleteConversation, restoreConversation } from '../services/conversation.service.js';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function ConversationsPage() {
  const { hasPermission } = usePermissions();
  const { addMessage, addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'name',
        headerName: 'Nombre',
        flex: 1,
      },
      {
        field: 'code',
        headerName: 'Código',
        flex: 1,
      },
      {
        field: 'accessCode',
        headerName: 'Código de acceso',
        flex: 1,
        renderCell: ({value}) => showAccessCode ? value : '****',
      },
      {
        field: 'isActive',
        headerName: 'Activo',
        renderCell: ({value}) => value ? '✔️' : '❌',
      },
      {
        field: 'status',
        headerName: 'Estado',
        renderCell: ({value}) => getStatusNameByValue(value),
        flex: 1,
      },
      {
        field: 'deletedAt',
        headerName: 'Eliminado',
        renderCell: ({value}) => formatDate(value) || 'No eliminado',
        width: 130,
        condition: () => includeDeleted,
      },
    ];

    return baseColumns.filter(col => !col.condition || col.condition());
  }, [includeDeleted]);

  const load = useCallback(async () => {
    try {
      const query = {};
      if (includeDeleted) {
        query.includeDeleted = 1;
      }

      const res = await getConversations({ query });
      setData(res);
    } catch (error) {
      addError('Error al obtener las convesaciones');
      console.error('Error al obtener las convesaciones:', error);
    }
  }, [includeDeleted, addError]);

  async function deleteConversationHandler({ uuid }) {
    try {
      await deleteConversation(uuid);
      addMessage('Conversación eliminada correctamente');
      load();
    } catch (error) {
      addError('Error al eliminar la conversación');
      console.error('Error al eliminar la conversación:', error);
    }
  }

  async function restoreConversationHandler({ uuid }) {
    try {
      await restoreConversation(uuid);
      addMessage('Conversación restaurada correctamente');
      load();
    } catch (error) {
      addError('Error al restaurar la conversación');
      console.error('Error al restaurar la conversación:', error);
    }
  }

  useEffect(() => { load(); }, [load]);

  return <Grid
    title="Conversaciones"
    columns={columns}
    rows={data}
    onReload={() => load()}
    createPath={hasPermission('conversations.create') && "/conversations/new"}
    onDelete={hasPermission('conversations.delete') && deleteConversationHandler}
    editPath={hasPermission('conversations.update') && "/conversations/:uuid/edit"}
    onRestore={hasPermission('conversations.restore') && restoreConversationHandler}
    tools={<>
      {hasPermission('conversations.restore') && 
        <SwitchField
          label="Incluir eliminadas"
          checked={includeDeleted}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
        />
      }
    </>}
  />;
}