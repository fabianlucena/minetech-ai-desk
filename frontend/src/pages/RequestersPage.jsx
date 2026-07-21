import { useState, useEffect, useMemo } from 'react';
import Grid from '../components/Grid.jsx';
import { useToast } from '../states/toast.jsx';
import { hasPermission } from '../states/global.jsx';
import { formatDate } from '../utils/date.js';
import { getRequesters } from '../services/requester.service.js';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function RequestersPage() {
  const { addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'fullName',
        headerName: 'Nombre',
        flex: 1,
      },
      {
        field: 'phone',
        headerName: 'Teléfono',
        flex: 1,
      },
      {
        field: 'isActive',
        headerName: 'Activo',
        renderCell: ({value}) => value ? '✔️' : '❌',
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

  async function load() {
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
  }

  useEffect(() => {
    load();
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [includeDeleted]);

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
  />;
}