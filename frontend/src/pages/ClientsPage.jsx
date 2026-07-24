import { useState, useEffect, useMemo, useCallback } from 'react';
import Grid from '../components/Grid.jsx';
import useToast from '../states/useToast.jsx';
import usePermissions from '../states/usePermissions.jsx';
import { formatDate } from '../utils/date.js';
import { getClients, deleteClient, restoreClient, getStatus } from '../services/client.service.js';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function ClientsPage() {
  const { hasPermission } = usePermissions();
  const { addMessage, addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [status, setStatus] = useState([]);

  const getStatusNameByValue = useCallback((value) => {
    return status.find(s => s.value === value)?.name ?? value;
  }, [status]);

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
  }, [includeDeleted, showAccessCode, getStatusNameByValue]);

  const load = useCallback(async () => {
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
  }, [includeDeleted, addError]);

  const loadStatus = useCallback(async () => {
    try {
      const res = await getStatus();
      setStatus(res);
    } catch (error) {
      addError('Error al obtener los estados');
      console.error('Error al obtener los estados:', error);
    }
  }, [addError]);

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

  useEffect(() => { loadStatus(); }, [loadStatus]);
  useEffect(() => { load(); }, [load]);

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