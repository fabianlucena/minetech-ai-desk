import { useState, useEffect, useMemo } from 'react';
import Grid from '../components/Grid.jsx';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../state/toast.jsx';
import { hasPermission } from '../state/global.jsx';
import { formatDate } from '../utils/date.js';
import Chips from '../components/Chips.jsx';
import { getClients, deleteClient, restoreClient } from '../services/client.service.js';
import { PasswordIcon } from '../components/icons/index.jsx';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function Clients() {
  const navigate = useNavigate();
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
        field: 'clientCode',
        headerName: 'Código',
        flex: 1,
      },
      {
        field: 'isActive',
        headerName: 'Activo',
        renderCell: ({value}) => value ? '✔️' : '❌',
      },
      {
        field: 'status',
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

  async function load() {
    try {
      const query = {};
      if (includeDeleted) {
        query.includeDeleted = 1;
      }

      const res = await getClients({ query });
      setData(res);
    } catch (error) {
      addError('Error al obtener los técnicos');
      console.error('Error al obtener los técnicos:', error);
    }
  }

  async function deleteClientHandler({ uuid }) {
    try {
      await deleteClient(uuid);
      addMessage('Técnico eliminado correctamente');
      load();
    } catch (error) {
      addError('Error al eliminar el técnico');
      console.error('Error al eliminar el técnico:', error);
    }
  }

  async function restoreClientHandler({ uuid }) {
    try {
      await restoreClient(uuid);
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
    title="Clientes"
    columns={columns}
    rows={data}
    onReload={() => load()}
    createPath={hasPermission('clients.create') && "/clients/new"}
    onDelete={hasPermission('clients.delete') && deleteClientHandler}
    editPath={hasPermission('clients.update') && "/clients/:uuid/edit"}
    onRestore={hasPermission('clients.restore') && restoreClientHandler}
    tools={<>
      {hasPermission('clients.restore') && 
        <SwitchField
          label="Incluir eliminados"
          checked={includeDeleted}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
        />
      }
    </>}
  />;
}