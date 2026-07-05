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
  columnIdName = 'uuid',
  tools,
  onReload,
  onCreate,
  createPath,
  onDelete,
  onEdit,
  editPath,
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
    if (!onDelete)
      return;

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
    if (onDelete || onEdit || editPath) {
      let rowsActions = effectiveColumns.find(col => col.field === 'rowsActions');
      if (!rowsActions) {
        rowsActions = {
          field: 'rowsActions',
          headerName: 'Acciones',
        };
        effectiveColumns.push(rowsActions);
      }

      const previousRenderCell = rowsActions.renderCell;
      rowsActions.renderCell = (params) => {
        return <>
          {previousRenderCell?.(params)}
          {onDelete && <DeleteButton onClick={() => handleDelete(params.row)} />}
          {onEdit && <EditButton onClick={() => onEdit(params.row)} />}
          {editPath && <EditButton onClick={() => navigate(editPath.replace(':uuid', params.row[columnIdName]))} />}
        </>;
      };
    }
    setEffectiveColumns(effectiveColumns);
  }, [columns, onDelete, onEdit, editPath]);

  return <Box
    sx={{
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
      rows={rows}
      columns={effectiveColumns}
      getRowId={(row) => row[columnIdName]}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    />
  </Box>;
}
