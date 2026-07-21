import { useState, useEffect, useMemo } from 'react';
import Grid from '../components/Grid.jsx';
import { useToast } from '../state/toast.jsx';
import { hasPermission } from '../state/global.jsx';
import { formatDate } from '../utils/date.js';
import Chip from '../components/Chip.jsx';
import { getTechnicians, deleteTechnician, restoreTechnician } from '../services/technician.service.js';
import SwitchField from '../components/fields/SwitchField.jsx';
import { getLighterColor } from '../utils/color.js';

export default function TechniciansPage() {
  const { addMessage, addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [rowColors, setRowColors] = useState({});

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
        field: 'color',
        headerName: 'Color',
        renderCell: ({value}) => <Chip color={value ?? ''} />,
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

      const data = await getTechnicians({ query });
      setData(data);

      const rowColors = data.reduce((acc, row) => {
        acc[`& .row-${row.uuid}`] = { backgroundColor: getLighterColor(row.color, .75) };
        return acc;
      }, {});
      setRowColors(rowColors);
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
  // oxlint-disable-next-line react-hooks/exhaustive-deps
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
    getRowClassName={(params) => `row-${params.id}`}
    sx={{ ...rowColors }}
  />;
}