import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ObjectsList from './ObjectsList.jsx';
import { Box, Typography } from '@mui/material';
import { ReloadButton, CreateButton } from './buttons/index.jsx';
import { DeleteIcon, EditIcon, RestoreIcon } from './icons/index.jsx';
import ConfirmDialog from './dialogs/ConfirmDialog.jsx';
import ObjectAction from './ObjectAction.jsx';

export default function Objects({
  title,
  description,
  items,
  itemActions,
  renderItem,
  itemIdName = 'uuid',
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
      items.map(item => item[itemIdName])
    );

    const addedIds = [...currentIds].filter(
      id => !previousIdsRef.current.has(id)
    );

    if (previousIdsRef.current.size > 0) {
      setNewItems(new Set(addedIds));
    }

    previousIdsRef.current = currentIds;
  }, [items, itemIdName]);

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

  const effectiveItemActions = useCallback((params) => {
    return [
      onDelete && !params?.item?.deletedAt && <ObjectAction
        key="delete"
        icon={<DeleteIcon color="error" />}
        label="Eliminar"
        onClick={() => handleDelete(params?.item)}
      />,
      onEdit && !params?.item?.deletedAt && <ObjectAction
        key="edit"
        icon={<EditIcon color="primary" />}
        label="Editar"
        onClick={() => onEdit(params?.item)}
      />,
      editPath && !params?.item?.deletedAt && <ObjectAction
        key="edit"
        icon={<EditIcon color="primary" />}
        label="Editar"
        onClick={() => navigate(editPath.replace(':uuid', params?.item?.[itemIdName]))}
      />,
      onRestore && params?.item?.deletedAt && <ObjectAction
        key="restore"
        icon={<RestoreIcon color="primary" />}
        label="Restaurar"
        onClick={() => onRestore(params?.item)}
      />,
      ...itemActions?.(params)?.filter(action => action) || [],
    ].filter(action => action !== null && action !== undefined);
  }, [onDelete, onEdit, editPath, onRestore, itemActions, itemIdName, navigate, handleDelete]);

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
        {title && <Typography className="page-title" variant="h6" fontWeight={600}>
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
      renderItem={renderItem}
      getItemId={(item) => item[itemIdName]}
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

        if (newItems.has(params.item[itemIdName]))
            className += ' item-new';

        return className;
      }}
      itemActions={effectiveItemActions}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
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
