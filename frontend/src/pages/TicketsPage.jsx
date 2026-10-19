import { useState, useEffect, useMemo, useCallback } from 'react';
import Grid from '../components/Grid.jsx';
import { formatDate } from '../utils/datetime.js';
import useTicket from '../services/useTicket.jsx';
import { getLighterColor } from '../utils/color.js';

export default function TicketsPage() {
  const { getTickets } = useTicket();
  const [data, setData] = useState([]);
  const [includeDeleted] = useState(false);
  const [rowColors, setRowColors] = useState({});

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'code',
        headerName: 'Código',
        flex: 1,
      },
      {
        field: 'client',
        headerName: 'Cliente',
        flex: 1,
        renderCell: ({ value }) => value?.name || 'N/D',
      },
      {
        field: 'requester',
        headerName: 'Solicitante',
        flex: 1,
        renderCell: ({ value }) => value?.displayName || 'N/D',
      },
      {
        field: 'technician',
        headerName: 'Técnico',
        flex: 1,
        renderCell: ({ value }) => value?.displayName || 'N/D',
      },
      {
        field: 'statusName',
        headerName: 'Estado',
        flex: 1,
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

  const load = useCallback(async () => {
    try {
      const query = {
        includeClient: 1,
        includeRequester: 1,
        includeTechnician: 1,
        includeTechnicianName: 1,
      };
      
      if (includeDeleted) {
        query.includeDeleted = 1;
      }

      const data = await getTickets({ query });
      setData(data);

      const rowColors = data.reduce((acc, row) => {
        acc[`& .row-${row.uuid}`] = { backgroundColor: getLighterColor(row.color, .75) };
        return acc;
      }, {});
      setRowColors(rowColors);
    } catch (error) {
      addError('Error al obtener los tickets');
      console.error('Error al obtener los tickets:', error);
    }
  }, [includeDeleted, getTickets]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    load();
  }, [load]);

  return <Grid
    title="Técnicos"
    columns={columns}
    rows={data}
    onReload={() => load()}
    getRowClassName={(params) => `row-${params.id}`}
    sx={{ ...rowColors }}
  />;
}