import { useState, useEffect, useMemo } from 'react';
import Grid from '../components/Grid.jsx';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../state/toast.jsx';
import { hasPermission } from '../state/global.jsx';
import { formatDate } from '../utils/date.js';
import Chips from '../components/Chips.jsx';
import { getUsers, deleteUser } from '../services/user.service.js';
import { PasswordIcon } from '../components/icons';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function Usuarios() {
  const navigate = useNavigate();
  const { addMessage, addError } = useToast();
  const [data, setData] = useState([]);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        field: 'username',
        headerName: 'Usuario',
        flex: 1,
      },
      {
        field: 'displayName',
        headerName: 'Nombre',
        flex: 1,
      },
      {
        field: 'isActive',
        headerName: 'Activo',
        renderCell: ({value}) => value ? '✔️' : '❌',
      },
      {
        field: 'hasPassword',
        headerName: 'Contraseña',
        renderCell: ({value}) => value ? '✔️' : '❌',
      },
      {
        field: 'canLogin',
        headerName: 'Conectable',
        renderCell: ({value}) => value ? '✔️' : '❌',
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

  async function load() {
    try {
      const query = {};
      if (includeDeleted) {
        query.includeDeleted = 1;
      }

      const res = await getUsers({ query });
      setData(res);
    } catch (error) {
      addError('Error al obtener los usuarios');
      console.error('Error al obtener los usuarios:', error);
    }
  }

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
    alert('Restaurar usuario\nEsta funcionalidad aún no está implementada');
  }

  useEffect(() => {
    load();
  }, [includeDeleted]);

  return <Grid
    title="Usuarios"
    columns={columns}
    rows={data}
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
        icon={<PasswordIcon />}
        label="Cambiar contraseña"
        onClick={() => navigate(`/users/${row.uuid}/change-password`)}
      />
    ]}
  />;
}