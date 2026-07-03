import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { ReloadButton, CreateButton } from './buttons';

export default function Grid({
  title,
  description,
  rows,
  columns,
  tools,
  onReload,
  onCreate,
  createPath,
}) {
  const navigate = useNavigate();

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
    {(title || description || tools || onReload || onCreate || createPath) && <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        {title && <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>}
        {description && <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>}
      </Box>
      {(tools || onReload || onCreate || createPath) && <Box sx={{ marginTop: 1 }}>
        {tools}
        {onCreate && <CreateButton onClick={onCreate} />}
        {createPath && <CreateButton onClick={() => navigate(createPath)} />}
        {onReload && <ReloadButton onClick={onReload} />}
      </Box>}
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
