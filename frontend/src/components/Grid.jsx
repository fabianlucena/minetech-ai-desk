import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

export default function Grid({
  title,
  description,
  rows,
  columns,
}) {
  return <Box
    sx={{
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#F4C300',
        color: '#1A1A1A',
        fontWeight: 'bold',
      },
      '& .MuiDataGrid-row:hover': {
        backgroundColor: '#FFF7D1',
      },
      height: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    {(title || description) && <Box>
      {title && <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>}
      {description && <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>}
    </Box>}
    <DataGrid
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      rows={rows}
      columns={columns}
    />
  </Box>;
}
