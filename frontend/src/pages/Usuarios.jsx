import { useState } from 'react';
import Grid from '../components/Grid';
import { userService } from '../services/user.service.js';
import { useToast } from '../state/toast.jsx';

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

  useState(() => {
    userService().then((res) => {
      setData(res);
    }).catch((error) => {
      addError('Error al obtener los usuarios');
      console.error('Error al obtener los usuarios:', error);
    });
  }, []);

  return <Grid
    title="Usuarios"
    rows={data}
    columns={columns}
  />;
}