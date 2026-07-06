import { useState, useEffect, useMemo } from 'react';
import Grid from '../components/Grid.jsx';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../state/toast.jsx';
import { hasPermission } from '../state/global.jsx';
import { formatDate } from '../utils/date.js';
import Chips from '../components/Chips.jsx';
import { getOperators } from '../services/operator.service.js';
import { PasswordIcon } from '../components/icons/index.jsx';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function Operators() {
  const navigate = useNavigate();
  const { addMessage, addError } = useToast();
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

      const res = await getOperators({ query });
      setData(res);
    } catch (error) {
      addError('Error al obtener los operatores');
      console.error('Error al obtener los operatores:', error);
    }
  }

  useEffect(() => {
    load();
  }, [includeDeleted]);

  return <Grid
    title="Operatores"
    columns={columns}
    rows={data}
    onReload={() => load()}
    tools={<>
      {hasPermission('operators.restore') && 
        <SwitchField
          label="Incluir eliminados"
          checked={includeDeleted}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
        />
      }
    </>}
  />;
}