import { useState } from 'react';
import FormDialog from './FormDialog.jsx';
import TextField from './fields/TextField.jsx';
import { banRequester } from '../services/requester.service.js';
import useToast from '../states/useToast.jsx';
import Button from './buttons/Button.jsx';
import { Box } from '@mui/material';

const banReasons = [
  'Span',
  'Fraude',
  'Desconocido',
  'Desvinculado',
  'Inapropiado',
  'Motivos legales',
];

export default function BanRequesterDialog({
  requester,
  onSubmit,
  ...rest
}) {
  const [disabled, setDisabled] = useState(false);
  const { addInfo, addError } = useToast();
  const [data, setData] = useState({
    banReason: '',
  });

  function getValidationError() {
    if (!data.banReason || data.banReason.trim() === '')
      return 'Debe proporcionar un motivo para el baneo';
  }

  async function onSubmitHandler() {
    setDisabled(true);
    try {

      await banRequester(requester.uuid, {
        banReason: data.banReason,
      });
      addInfo('Solicitante baneado correctamente');
      onSubmit?.();
    } catch (error) {
      console.error('Error al banear solicitante:', error);
      addError('Error al banear solicitante: ' + (error.data?.message || error.message || error.data?.error));
    }
    setDisabled(false);
  }

  return <FormDialog
    title={'Banear solicitante: ' + requester?.displayName}
    disabled={disabled}
    validationError={getValidationError()}
    unchangedData={data.banReason.trim() === ''}
    onSubmit={onSubmitHandler}
    submitConfirmTitle={`¿Está seguro de que desea banear al solicitante ${requester?.displayName}?`}
    submitConfirmMessage="Una vez baneado, no se proccesarán sus mensajes entrantes."
    submitConfirmText="Banear"
    submitCancelText="Cancelar"
    {...rest}
  >
    <TextField 
      label="Motivo del baneo"
      value={data.banReason || ''}
      onChange={(e) => setData({ ...data, banReason: e.target.value })}
    />
    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
      {banReasons.map((reason) => (
        <Button key={reason} onClick={() => setData({ ...data, banReason: reason })}>
          {reason}
        </Button>
      ))}
    </Box>
  </FormDialog>;
}