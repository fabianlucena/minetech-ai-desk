import { useState, useEffect, useMemo } from 'react';
import Grid from '../components/Grid.jsx';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../state/toast.jsx';
import { hasPermission } from '../state/global.jsx';
import { formatDate } from '../utils/date.js';
import Chips from '../components/Chips.jsx';
import { getTechnicians, deleteTechnician, restoreTechnician } from '../services/technician.service.js';
import { PasswordIcon } from '../components/icons/index.jsx';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function Technicians() {
  const navigate = useNavigate();
  const { addMessage, addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'fullName',
        headerName: 'Nombre completo',
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
    ];

    if (includeDeleted) {
      baseColumns.push({
        field: 'deletedAt',
        headerName: 'Eliminado',
        renderCell: ({value}) => formatDate(value) || 'No eliminado',
        width: 130,
      });
    }

    return baseColumns;
  }, [includeDeleted]);

  async function load() {
    try {
      const query = {};
      if (includeDeleted) {
        query.includeDeleted = 1;
      }

      const res = await getTechnicians({ query });
      setData(res);
    } catch (error) {
      addError('Error al obtener los técnicos');
      console.error('Error al obtener los técnicos:', error);
    }
  }

  async function deleteTechnicianHandler({ uuid }) {
    try {
      await deleteTechnician(uuid);
      addMessage('Técnico eliminado correctamente');
      load();
    } catch (error) {
      addError('Error al eliminar el técnico');
      console.error('Error al eliminar el técnico:', error);
    }
  }

  async function restoreTechnicianHandler({ uuid }) {
    try {
      await restoreTechnician(uuid);
      addMessage('Técnico restaurado correctamente');
      load();
    } catch (error) {
      addError('Error al restaurar el técnico');
      console.error('Error al restaurar el técnico:', error);
    }
  }

  useEffect(() => {
    load();
  }, [includeDeleted]);

  return <Grid
    title="Técnicos"
    columns={columns}
    rows={data}
    onReload={() => load()}
    createPath={hasPermission('technicians.create') && "/technicians/new"}
    onDelete={hasPermission('technicians.delete') && deleteTechnicianHandler}
    editPath={hasPermission('technicians.update') && "/technicians/:uuid/edit"}
    onRestore={hasPermission('technicians.restore') && restoreTechnicianHandler}
    tools={<>
      {hasPermission('technicians.restore') && 
        <SwitchField
          label="Incluir eliminados"
          checked={includeDeleted}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
        />
      }
    </>}
  />;
}