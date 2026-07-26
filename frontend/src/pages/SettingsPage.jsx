import { useState, useEffect, useMemo, useCallback } from 'react';
import Grid from '../components/Grid.jsx';
import useToast from '../states/useToast.jsx';
import usePermissions from '../states/usePermissions.jsx';
import { formatDate } from '../utils/date.js';
import { getSettings, deleteSetting, restoreSetting } from '../services/setting.service.js';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function SettingsPage() {
  const { hasPermission } = usePermissions();
  const { addMessage, addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'key',
        headerName: 'Clave',
        flex: 1,
      },
      {
        field: 'value',
        headerName: 'Valor',
        flex: 1,
        renderCell: ({ value }) => value == null ? '' : (typeof value === 'object' ? JSON.stringify(value) : String(value)),
      },
      {
        field: 'description',
        headerName: 'Descripción',
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
      const query = {};
      if (includeDeleted) {
        query.includeDeleted = 1;
      }

      const res = await getSettings({ query });
      setData(res);
    } catch (error) {
      addError('Error al obtener las configuraciones');
      console.error('Error al obtener las configuraciones:', error);
    }
  }, [addError, includeDeleted]);

  async function deleteSettingHandler({ uuid }) {
    try {
      await deleteSetting(uuid);
      addMessage('Configuración eliminada correctamente');
      load();
    } catch (error) {
      addError('Error al eliminar la configuración');
      console.error('Error al eliminar la configuración:', error);
    }
  }

  async function restoreSettingHandler({ uuid }) {
    try {
      await restoreSetting(uuid);
      addMessage('Configuración restaurada correctamente');
      load();
    } catch (error) {
      addError('Error al restaurar la configuración');
      console.error('Error al restaurar la configuración:', error);
    }
  }

  useEffect(() => {
    load();
  }, [load]);

  return <Grid
    title="Configuraciones"
    columns={columns}
    rows={data}
    onReload={() => load()}
    createPath={hasPermission('settings.create') && "/settings/new"}
    onDelete={hasPermission('settings.delete') && deleteSettingHandler}
    editPath={hasPermission('settings.update') && "/settings/:uuid/edit"}
    onRestore={hasPermission('settings.restore') && restoreSettingHandler}
    tools={<>
      {hasPermission('settings.restore') && 
        <SwitchField
          label="Incluir eliminados"
          checked={includeDeleted}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
        />
      }
    </>}
  />;
}