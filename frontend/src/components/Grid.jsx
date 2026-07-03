import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { ReloadButton, CreateButton, DeleteButton, EditButton } from './buttons';
import ConfirmDialog from './ConfirmDialog.jsx';

export default function Grid({
  title,
  description,
  rows,
  columns,
  tools,
  onReload,
  onCreate,
  onDelete,
  onEdit,
  createPath,
  deleteConfirmationMessage = '¿Está seguro de que desea eliminar este elemento?',
}) {
  const navigate = useNavigate();
  const [effectiveColumns, setEffectiveColumns] = useState(columns);
  const [confirmation, setConfirmation] = useState({
    open: false,
    onClose: () => setConfirmation({...confirmation, open: false}),
    title: 'Confirmar',
    message: '',
  });

  function handleDelete(row) {
    if (!deleteConfirmationMessage) {
      onDelete(row);
      return;
    }

    setConfirmation({
      ...confirmation,
      open: true,
      title: 'Confirmar eliminación',
      message: deleteConfirmationMessage,
      onConfirm: () => {
        onDelete(row);
      },
    });
  }

  useEffect(() => {
    const effectiveColumns = [...columns];
    if (onDelete || onEdit) {
      let rowsActions = effectiveColumns.find(col => col.field === 'rowsActions');
      if (!rowsActions) {
        rowsActions = {
          field: 'rowsActions',
          headerName: 'Acciones',
        };
        effectiveColumns.push(rowsActions);
      }

      if (onDelete) {
        const previousRenderCell = rowsActions.renderCell;
        rowsActions.renderCell = (params) => {
          return <>
            {previousRenderCell?.(params)}
            <DeleteButton onClick={() => handleDelete(params.row)} />
          </>;
        };
      }

      if (onEdit) {
        const previousRenderCell = rowsActions.renderCell;
        rowsActions.renderCell = (params) => {
          return <>
            {previousRenderCell?.(params)}
            <EditButton onClick={() => onEdit(params.row)} />
          </>;
        };
      }
    }
    setEffectiveColumns(effectiveColumns);
  }, [columns, onDelete, onEdit]);

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
    <ConfirmDialog {...confirmation} />

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
      columns={effectiveColumns}
    />
  </Box>;
}
