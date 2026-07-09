import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { ReloadButton, CreateButton } from './buttons';
import { DeleteIcon, EditIcon, RestoreIcon } from './icons';
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
  onRestore,
  deleteConfirmationMessage = '¿Está seguro de que desea eliminar este elemento?',
  getRowClassName,
  sx,
  ...props
}) {
  const navigate = useNavigate();
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

  const effectiveColumns = useMemo(() => {
    const effectiveColumns = [...columns];
    if (onDelete || onEdit || editPath || onRestore) {
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
        onDelete && !params.row.deletedAt && <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handleDelete(params.row)}
        />,
        onEdit && !params.row.deletedAt && <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => onEdit(params.row)}
        />,
        editPath && !params.row.deletedAt && <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => navigate(editPath.replace(':uuid', params.row[columnIdName]))}
        />,
        onRestore && params.row.deletedAt && <GridActionsCellItem
          icon={<RestoreIcon />}
          label="Restaurar"
          onClick={() => onRestore(params.row)}
        />,
      ];
    }

    return effectiveColumns;
  }, [columns, onDelete, onEdit, editPath, onRestore]);

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
      getRowClassName={(params) => {
        let className = getRowClassName?.(params);
        if (!className) {
          if (params.row.deletedAt)
            className = 'row-deleted';
          else
            className = params.indexRelativeToCurrentPage % 2 === 0
              ? 'row-even'
              : 'row-odd';
        }

        return className;
      }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      sx={{
        '& .row-even': {
          backgroundColor: '#f7f7f7',
        },
        '& .row-odd': {
          backgroundColor: '#ffffff',
        },
        '& .row-deleted': {
          backgroundColor: 'rgba(255, 0, 0, 0.08)',
          '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.15)',
          },
        },
        ...sx,
      }}
      {...props}
    />
  </Box>;
}
