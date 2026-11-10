import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ObjectsList from './ObjectsList.jsx';
import { Box, Typography } from '@mui/material';
import { ReloadButton, CreateButton } from './buttons/index.jsx';
import { DeleteIcon, EditIcon, RestoreIcon } from './icons/index.jsx';
import ConfirmDialog from './dialogs/ConfirmDialog.jsx';

export default function Objects({
  title,
  description,
  items,
  itemsActions,
  properties = [],
  propertyIdName = 'uuid',
  tools,
  onReload,
  onCreate,
  createPath,
  onDelete,
  onEdit,
  editPath,
  onRestore,
  deleteConfirmationMessage = '¿Está seguro de que desea eliminar este elemento?',
  getItemClassName,
  sx,
  ...props
}) {
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState({
    open: false,
    onClose: () => setConfirmation({...confirmation, open: false}),
    title: 'Confirmar',
    content: '',
  });
  const [newItems, setNewItems] = useState(new Set());
  const previousIdsRef  = useRef(new Set());

  useEffect(() => {
    const currentIds = new Set(
      items.map(item => item[propertyIdName])
    );

    const addedIds = [...currentIds].filter(
      id => !previousIdsRef.current.has(id)
    );

    if (previousIdsRef.current.size > 0) {
      setNewItems(new Set(addedIds));
    }

    previousIdsRef.current = currentIds;
  }, [items, propertyIdName]);

  useEffect(() => {
    if (newItems.size === 0)
      return;

    const timer = setTimeout(() => {
      setNewItems(new Set());
    }, 2000);

    return () => clearTimeout(timer);
  }, [newItems]);

  const handleDelete = useCallback((item) => {
    if (!onDelete)
      return;

    if (!deleteConfirmationMessage) {
      onDelete(item);
      return;
    }

    setConfirmation({
      ...confirmation,
      open: true,
      title: 'Confirmar eliminación',
      content: deleteConfirmationMessage,
      onConfirm: () => {
        onDelete(item);
      },
    });
  }, [onDelete, deleteConfirmationMessage, confirmation]);

  const effectiveProperties = useMemo(() => {
    const effectiveProperties = [...properties];
    if (onDelete || onEdit || editPath || onRestore || itemsActions) {
      let actionsField = effectiveProperties.find(col => col.field === 'actions');
      if (!actionsField) {
        actionsField = {
          field: 'actions',
          type: 'actions',
          headerName: 'Acciones',
        };
        effectiveProperties.push(actionsField);
      }

      actionsField.getActions = (params) => [
        onDelete && !params?.item?.deletedAt && <div
          key="delete"
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handleDelete(params?.item)}
        />,
        onEdit && !params?.item?.deletedAt && <div
          key="edit"
          icon={<EditIcon />}
          label="Editar"
          onClick={() => onEdit(params?.item)}
        />,
        editPath && !params?.item?.deletedAt && <div
          key="edit"
          icon={<EditIcon />}
          label="Editar"
          onClick={() => navigate(editPath.replace(':uuid', params?.item?.[propertyIdName]))}
        />,
        onRestore && params?.item?.deletedAt && <div
          key="restore"
          icon={<RestoreIcon />}
          label="Restaurar"
          onClick={() => onRestore(params?.item)}
        />,
        ...itemsActions?.(params) || [],
      ];

      actionsField.width = 40 * actionsField.getActions({ item: { deletedAt: false }}).filter(a => a).length;
    }

    return effectiveProperties;
  }, [properties, onDelete, onEdit, editPath, onRestore, itemsActions, propertyIdName, navigate, handleDelete]);

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
    <ObjectsList
      items={items}
      properties={effectiveProperties}
      getItemId={(item) => item[propertyIdName]}
      getItemClassName={(params) => {
        let className = getItemClassName?.(params);
        if (!className) {
          if (params.item.deletedAt)
            className = 'item-deleted';
          else
            className = params.indexRelativeToCurrentPage % 2 === 0
              ? 'item-even'
              : 'item-odd';
        }

        if (newItems.has(params.item[propertyIdName]))
            className += ' item-new';

        return className;
      }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'property',
        overflow: 'hidden',
      }}
      sx={{
        '& .MuiDataGrid-actionsCell': {
          justifyContent: 'flex-start',
          flex: 1,
        },
        '& .item-even': {
          backgroundColor: '#f7f7f7',
        },
        '& .item-odd': {
          backgroundColor: '#ffffff',
        },
        '& .item-deleted': {
          backgroundColor: 'rgba(255, 0, 0, 0.08)',
          '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.15)',
          },
        },
        '& .item-new': {
          animation: 'highlight-new-item 2s ease-out forwards',
        },

        '@keyframes highlight-new-item': {
          '0%':   { backgroundColor: 'transparent' },
          '5%':   { backgroundColor: '#9cd2f7' },
          '10%':  { backgroundColor: 'transparent' },
          '15%':  { backgroundColor: '#9cd2f7' },
          '20%':  { backgroundColor: 'transparent' },
          '25%':  { backgroundColor: '#9cd2f7' },
          '30%':  { backgroundColor: 'transparent' },
          '35%':  { backgroundColor: '#9cd2f7' },
          '100%': { backgroundColor: 'transparent' }
        },
        ...sx,
      }}
      {...props}
    />
  </Box>;
}
