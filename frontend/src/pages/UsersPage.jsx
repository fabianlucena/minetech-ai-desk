import { useState, useEffect, useMemo, useCallback } from 'react';
import Grid from '../components/Grid.jsx';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import useToast from '../contexts/useToast';
import usePermissions from '../contexts/usePermissions';
import { formatDate } from '../utils/datetime.js';
import Chips from '../components/Chips.jsx';
import useUser from '../services/useUser';
import { PasswordIcon } from '../components/icons';
import SwitchField from '../components/fields/SwitchField.jsx';
import useDataNotifications from '../services/useDataNotifications.jsx';

export default function UsersPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const { addMessage, addError } = useToast();
  const { getUsers, deleteUser, restoreUser } = useUser();
  const { subscribe } = useDataNotifications();
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20
  });

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'displayName',
        headerName: 'Nombre completo',
        flex: 1,
      },
      {
        field: 'username',
        headerName: 'Usuario',
        flex: 1,
      },
      {
        field: 'email',
        headerName: 'Correo electrónico',
        flex: 1,
      },
      {
        field: 'isActive',
        headerName: 'Activo',
        renderCell: ({value}) => value ? '🟢' : '🔴',
      },
      {
        field: 'hasPassword',
        headerName: 'Contraseña',
        renderCell: ({value}) => value ? '🟢' : '⚪',
      },
      {
        field: 'canLogin',
        headerName: 'Conectable',
        renderCell: ({value}) => value ? '🟢' : '🚫',
      },
      {
        field: 'roles',
        headerName: 'Rol',
        renderCell: ({value}) => <Chips
          chips={value}
          mapper={role => ({ id: role.uuid, label: role.title })}
        />,
        width: 200,
      },
      {
        field: 'lastLoginAt',
        headerName: 'Última sesión',
        renderCell: ({value}) => formatDate(value) || 'Nunca',
        width: 130,
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
      const query = { ...paginationModel, includeCount: true };
      if (includeDeleted) {
        query.includeDeleted = 1;
      }

      const res = await getUsers({ query });
      setRows(res.rows);
      setRowCount(res.rowCount ?? res.rows.length);
    } catch (error) {
      addError('Error al obtener los usuarios');
      console.error('Error al obtener los usuarios:', error);
    }
  }, [addError, includeDeleted, getUsers, paginationModel]);

  useEffect(() => {
    function reload() {
      load();
    }
    reload();
  }, [load]);
  
  useEffect(() => subscribe('users', load), [subscribe, load]);

  async function deleteUserHandler({ uuid }) {
    try {
      await deleteUser(uuid);
      addMessage('Usuario eliminado correctamente');
      load();
    } catch (error) {
      addError('Error al eliminar el usuario');
      console.error('Error al eliminar el usuario:', error);
    }
  }

  async function restoreUserHandler({ uuid }) {
    try {
      await restoreUser(uuid);
      addMessage('Usuario restaurado correctamente');
      load();
    } catch (error) {
      addError('Error al restaurar el usuario');
      console.error('Error al restaurar el usuario:', error);
    }
  }

  return <Grid
    title="Usuarios"
    columns={columns}
    rows={rows}
    rowCount={rowCount}
    paginationMode="server"
    paginationModel={paginationModel}
    onPaginationModelChange={(...args) => { setRows([]); setPaginationModel(...args); }}
    pageSizeOptions={[10, 20, 50, 100]}
    onReload={() => load()}
    createPath={hasPermission('users.create') && "/users/new"}
    onDelete={hasPermission('users.delete') && deleteUserHandler}
    editPath={hasPermission('users.update') && "/users/:uuid/edit"}
    onRestore={hasPermission('users.restore') && restoreUserHandler}
    tools={<>
      {hasPermission('users.restore') && 
        <SwitchField
          label="Incluir eliminados"
          checked={includeDeleted}
          onChange={(e) => setIncludeDeleted(e.target.checked)}
        />
      }
    </>}
    rowsActions={({row}) => [
      hasPermission('users.update') && !row.deletedAt && <GridActionsCellItem
        key="change-password"
        icon={<PasswordIcon />}
        label="Cambiar contraseña"
        onClick={() => navigate(`/users/${row.uuid}/change-password`)}
      />
    ]}
  />;
}