import { useState } from 'react';
import Grid from '../components/Grid.jsx';
import { useToast } from '../state/toast.jsx';
import { hasPermission } from '../state/global.jsx';
import { formatDate } from '../utils/date.js';
import Chips from '../components/Chips.jsx';
import { getUsers } from '../services/user.service.js';

export default function Usuarios() {
  const { addError } = useToast();
  const [data, setData] = useState([]);

  const columns = [
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
      headerName: 'Último sesión',
      renderCell: ({value}) => formatDate(value) || 'Nunca',
      width: 130,
    },
  ];

  async function load() {
    try {
      const res = await getUsers();
      setData(res);
    } catch (error) {
      addError('Error al obtener los usuarios');
      console.error('Error al obtener los usuarios:', error);
    }
  }

  useState(() => {
    load();
  }, []);

  return <Grid
    title="Usuarios"
    columns={columns}
    rows={data}
    onReload={() => load()}
    createPath={hasPermission('users.create') ? "/users/new" : null}
    onDelete={hasPermission('users.delete') ? () => load() : null}
    editPath={hasPermission('users.update') ? "/users/:uuid/edit" : null}
  />;
}