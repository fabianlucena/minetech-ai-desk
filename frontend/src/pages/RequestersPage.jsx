import { useState, useEffect, useMemo } from 'react';
import Grid from '../components/Grid.jsx';
import useToast from '../states/useToast.jsx';
import usePermissions from '../states/usePermissions.jsx';
import { formatDate } from '../utils/datetime.js';
import { getRequesters, unbanRequester, deleteRequester, restoreRequester } from '../services/requester.service.js';
import SwitchField from '../components/fields/SwitchField.jsx';
import { BanIcon, UnbanIcon } from '../components/icons';
import { GridActionsCellItem } from '@mui/x-data-grid';
import ConfirmDialog from '../components/dialogs/ConfirmDialog.jsx';
import BanRequesterDialog from '../components/BanRequesterDialog.jsx';

export default function RequestersPage() {
  const { hasPermission } = usePermissions();
  const { addMessage, addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [banDialog, setBanDialog] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onClose: () => setConfirmDialog(prev => ({ ...prev, open: false })),
  });

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'displayName',
        headerName: 'Nombre',
        flex: 1,
      },
      {
        field: 'phone',
        headerName: 'Teléfono',
        flex: 1,
      },
      {
        field: 'client.name',
        headerName: 'Cliente',
        flex: 1,
        renderCell: ({row}) => row.client?.name || 'N/A',
      },
      {
        field: 'bannedAt',
        headerName: 'Baneado',
        renderCell: ({value}) => !value ? '🟢' : '🚫',
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

      const res = await getRequesters({ query });
      setData(res);
    } catch (error) {
      addError('Error al obtener los solicitantes');
      console.error('Error al obtener los solicitantes:', error);
    }
  }, [includeDeleted, addError]);

  useEffect(() => {
    load();
  }, [load]);

  function handleBan(requester) {
    setBanDialog({ open: true, requester });
  }

  function handleUnban({ uuid }) {
    setConfirmDialog(prev => ({
      ...prev,
      open: true,
      title: 'Confirmar desbaneo',
      message: '¿Está seguro de que desea desbanear a este solicitante? Sus mensajes entrantes volverán a procesarse.',
      confirmText: 'Desbanear',
      cancelText: 'Cancelar',
      onConfirm: () => handleUnbanConfirmed(uuid),
    }));
  }

  async function handleUnbanConfirmed(uuid) {
    try {
      await unbanRequester(uuid);
      addMessage('Solicitante desbaneado correctamente');
      load();
    } catch (error) {
      addError('Error al desbanear al solicitante');
      console.error('Error al desbanear al solicitante:', error);
    }
  }

  async function handleDeleteRequester({ uuid }) {
    try {
      await deleteRequester(uuid);
      addMessage('Solicitante eliminado correctamente');
      load();
    } catch (error) {
      addError('Error al eliminar el solicitante');
      console.error('Error al eliminar el solicitante:', error);
    }
  }

  async function handleRestoreRequester({ uuid }) {
    try {
      await restoreRequester(uuid);
      addMessage('Solicitante restaurado correctamente');
      load();
    } catch (error) {
      addError('Error al restaurar el solicitante');
      console.error('Error al restaurar el solicitante:', error);
    }
  }

  return <>
    <ConfirmDialog {...confirmDialog} />
    <BanRequesterDialog
      {...banDialog}
      onClose={() => setBanDialog({})}
      onSubmit={() => load()}
    />
    <Grid
      title="Solicitantes"
      columns={columns}
      rows={data}
      onReload={() => load()}
      onDelete={hasPermission('requesters.delete') && handleDeleteRequester}
      onRestore={hasPermission('requesters.restore') && handleRestoreRequester}
      tools={<>
        {hasPermission('requesters.restore') && 
          <SwitchField
            label="Incluir eliminados"
            checked={includeDeleted}
            onChange={(e) => setIncludeDeleted(e.target.checked)}
          />
        }
      </>}
      rowsActions={({row}) => [
          (hasPermission('requesters.ban') || hasPermission('requesters.update')) && !row.deletedAt && !row.bannedAt && <GridActionsCellItem
            key="ban"
            icon={<BanIcon />}
            label="Banear"
            onClick={() => handleBan(row)}
          />,
          (hasPermission('requesters.unban') || hasPermission('requesters.update')) && !row.deletedAt && !!row.bannedAt && <GridActionsCellItem
            key="unban"
            icon={<UnbanIcon />}
            label="Desbanear  "
            onClick={() => handleUnban({ uuid: row.uuid })}
          />
        ]}
    />
  </>;
}