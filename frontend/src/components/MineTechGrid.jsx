import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export default function MineTechGrid() {
  const rows = [
    { id: 1, name: 'Ticket 001', status: 'Abierto' },
    { id: 2, name: 'Ticket 002', status: 'Cerrado' },
  ];

  const columns = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'status', headerName: 'Estado', flex: 1 },
  ];

  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#F4C300',
          color: '#1A1A1A',
          fontWeight: 'bold',
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: '#FFF7D1',
        },
      }}
    >
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
}
