import { useState, useEffect, useMemo } from 'react';
import Grid from '../components/Grid.jsx';
import useToast from '../states/useToast.jsx';
import usePermissions from '../states/usePermissions.jsx';
import { formatDate } from '../utils/datetime.js';
import { getRequesters } from '../services/requester.service.js';
import SwitchField from '../components/fields/SwitchField.jsx';
import { BanIcon, UnbanIcon } from '../components/icons';
import { GridActionsCellItem } from '@mui/x-data-grid';

export default function RequestersPage() {
  const { hasPermission } = usePermissions();
  const { addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);

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

  function handleBan({ uuid }) {
    console.log(uuid);
  }

  function handleUnban({ uuid }) {
    console.log(uuid);
  }

  return <Grid
    title="Solicitantes"
    columns={columns}
    rows={data}
    onReload={() => load()}
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
          onClick={() => handleBan({ uuid: row.uuid })}
        />,
        (hasPermission('requesters.unban') || hasPermission('requesters.update')) && !row.deletedAt && !!row.bannedAt && <GridActionsCellItem
          key="unban"
          icon={<UnbanIcon />}
          label="Desbanear  "
          onClick={() => handleUnban({ uuid: row.uuid })}
        />
      ]}
  />;
}