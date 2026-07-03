import { useState } from 'react';
import Grid from '../components/Grid.jsx';
import { userService } from '../services/user.service.js';
import { useToast } from '../state/toast.jsx';
import { hasPermission } from '../state/global.jsx';

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
  ];

  async function load() {
    try {
      const res = await userService();
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
    onEdit={hasPermission('users.edit') ? () => load() : null}
  />;
}