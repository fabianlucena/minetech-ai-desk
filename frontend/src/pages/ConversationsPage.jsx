import { useState, useEffect, useMemo, useCallback } from 'react';
import Grid from '../components/Grid.jsx';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { CloseIcon, ConversationsMessageIcon } from '../components/icons';
import { useNavigate } from 'react-router-dom';
import useToast from '../states/useToast.jsx';
import usePermissions from '../states/usePermissions.jsx';
import { formatDate } from '../utils/datetime.js';
import { getConversations, deleteConversation, restoreConversation, closeConversation } from '../services/conversation.service.js';
import SwitchField from '../components/fields/SwitchField.jsx';
import ConfirmDialog from '../components/dialogs/ConfirmDialog.jsx';

export default function ConversationsPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const { addMessage, addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({});

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'requester.displayName',
        headerName: 'Solicitante',
        flex: 1,
        renderCell: ({row}) => row.requester?.displayName || '',
      },
      {
        field: 'requester.bannedAt',
        headerName: 'Baneado',
        renderCell: ({row}) => row.requester?.bannedAt ? '🚫' : '🟢',
      },
      {
        field: 'client.name',
        headerName: 'Cliente',
        flex: 1,
        renderCell: ({row}) => row.client?.name || '',
      },
      {
        field: 'lastMessageAt',
        headerName: 'Último mensaje',
        renderCell: ({value}) => formatDate(value) || '',
      },
      {
        field: 'closedAt',
        headerName: 'Abierta',
        renderCell: ({value}) => value ? '❌' : '🟢',
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
      addError('Error al obtener las conversaciones');
      console.error('Error al obtener las conversaciones:', error);
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


  async function closeConversationHandler({ uuid }) {
    setConfirmDialog({
      title: 'Cerrar conversación',
      message: '¿Estás seguro de que quieres cerrar esta conversación?',
      onConfirm: () => closeConversationConfirmedHandler({ uuid }),
      open: true,
      onClose: () => setConfirmDialog(prev => ({ ...prev, open: false })),
    });
  }

  async function closeConversationConfirmedHandler({ uuid }) {
    try {
      await closeConversation(uuid);
      addMessage('Conversación cerrada correctamente');
      load();
    } catch (error) {
      addError('Error al cerrar la conversación');
      console.error('Error al cerrar la conversación:', error);
    }
  }

  return <>
    <ConfirmDialog {...confirmDialog} />
    <Grid
      title="Conversaciones"
      columns={columns}
      rows={data}
      onReload={() => load()}
      onDelete={hasPermission('conversations.delete') && deleteConversationHandler}
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
      rowsActions={({row}) => [
        hasPermission('conversations.close') && !row.deletedAt && !row.closedAt && <GridActionsCellItem
          key="conversationsMessages"
          icon={<CloseIcon />}
          label="Cerrar conversación"
          onClick={() => closeConversationHandler({ uuid: row.uuid })}
        />,
        hasPermission('conversationMessages.list') && !row.deletedAt && <GridActionsCellItem
          key="conversationsMessages"
          icon={<ConversationsMessageIcon />}
          label="Mensages"
          onClick={() => navigate(`/conversations/${row.uuid}/messages`)}
        />
      ]}
    />
  </>;
}