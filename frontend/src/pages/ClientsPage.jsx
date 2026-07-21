import { useState, useEffect, useMemo } from 'react';
import Grid from '../components/Grid.jsx';
import { useToast } from '../state/toast.jsx';
import { hasPermission } from '../state/global.jsx';
import { formatDate } from '../utils/date.js';
import { getClients, deleteClient, restoreClient, getStatus } from '../services/client.service.js';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function ClientsPage() {
  const { addMessage, addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [status, setStatus] = useState([]);

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
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [includeDeleted, showAccessCode]);

  async function load() {
    try {
      const query = {};
      if (includeDeleted) {
        query.includeDeleted = 1;
      }

      const res = await getClients({ query });
      setData(res);
    } catch (error) {
      addError('Error al obtener los clientes');
      console.error('Error al obtener los clientes:', error);
    }
  }

  async function loadStatus() {
    try {
      const res = await getStatus();
      setStatus(res);
    } catch (error) {
      addError('Error al obtener los estados');
      console.error('Error al obtener los estados:', error);
    }
  }

  async function deleteClientHandler({ uuid }) {
    try {
      await deleteClient(uuid);
      addMessage('Cliente eliminado correctamente');
      load();
    } catch (error) {
      addError('Error al eliminar el cliente');
      console.error('Error al eliminar el cliente:', error);
    }
  }

  async function restoreClientHandler({ uuid }) {
    try {
      await restoreClient(uuid);
      addMessage('Cliente restaurado correctamente');
      load();
    } catch (error) {
      addError('Error al restaurar el cliente');
      console.error('Error al restaurar el cliente:', error);
    }
  }

  function getStatusNameByValue(value) {
    return status.find(s => s.value === value)?.name ?? value;
  }

  useEffect(() => {
    loadStatus();
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  // oxlint-disable-next-line react-hooks/exhaustive-deps
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
      <SwitchField
        label="Mostrar código de acceso"
        checked={showAccessCode}
        onChange={(e) => setShowAccessCode(e.target.checked)}
      />
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