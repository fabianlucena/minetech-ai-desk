import Grid from '../components/Grid';

export default function Usuarios() {
  const rows = [
    { id: 1, name: 'Ticket 001', status: 'Abierto' },
    { id: 2, name: 'Ticket 002', status: 'Cerrado' },
  ];

  const columns = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'status', headerName: 'Estado', flex: 1 },
  ];

  return <Grid
    title="Usuarios"
    rows={rows}
    columns={columns}
  />;
}