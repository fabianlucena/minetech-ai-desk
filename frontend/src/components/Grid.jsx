import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { ReloadButton, CreateButton } from './buttons';
import { DeleteIcon, EditIcon } from './icons';
import ConfirmDialog from './ConfirmDialog.jsx';

export default function Grid({
  title,
  description,
  rows,
  rowsActions,
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
      let actionsField = effectiveColumns.find(col => col.field === 'actions');
      if (!actionsField) {
        actionsField = {
          field: 'actions',
          type: 'actions',
          headerName: 'Acciones',
        };
        effectiveColumns.push(actionsField);
      }

      const previousGetActions = actionsField.getActions;
      actionsField.getActions = (params) => [
        ...rowsActions?.(params) || [],
        onDelete && <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handleDelete(params.row)}
        />,
        onEdit && <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => onEdit(params.row)}
        />,
        editPath && <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => navigate(editPath.replace(':uuid', params.row[columnIdName]))}
        />,
      ];
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
