import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { TextField, PasswordField } from '../components/fields';
import useToast from '../states/useToast.jsx';
import { getUser, updateUserPassword } from '../services/user.service.js';

const defaultData = {
  username: '',
  displayName: '',
  hasPassword: false,
  password: '',
};

export default function UserChangePasswordPage() {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { addInfo, addError } = useToast();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({...defaultData});
  const [unchangedData, setUnchangedData] = useState({...defaultData});

  const load = useCallback(async () => {
    try {
      const res = await getUser(uuid);
      const data = {
        ...defaultData,
        username: res.username,
        displayName: res.displayName,
        hasPassword: res.hasPassword,
      };
      setData(data);
      setUnchangedData(data);
    } catch (error) {
      addError('Error al obtener el usuario: ' + (error.data?.message || error.message || error.data?.error));
      console.error('Error al obtener el usuario:', error);
    }
  }, [uuid, addError]);

  useEffect(() => {
    if (!uuid) {
      addError('Error al obtener el usuario');
      navigate('/users');
      return;
    }

    load();
  }, [uuid, load, addError, navigate]);

  async function onSubmit() {
    setDisabled(true);
    try {
      await updateUserPassword(uuid, data.password);
      addInfo('Contraseña de usuario actualizada correctamente');
      navigate(-1);
    } catch (error) {
      console.error('Error al actualizar la contraseña del usuario:', error);
      addError('Error al actualizar contraseña del usuario');
    }
    setDisabled(false);
  }

  function getValidationError() {
    if (!data.password)
      return 'Debe proporcionar una contraseña';
  }

  return <Form
    title='Establecer contraseña de usuario'
    description='Ingrese la contraseña del usuario'
    disabledMessage='Estableciendo contraseña del usuario...'
    disabled={disabled}
    onSubmit={onSubmit}
    onCancelGoBack={true}
    validationError={getValidationError()}
    unchangedData={JSON.stringify(data) === JSON.stringify(unchangedData)}
  >
    <TextField
      label="Nombre completo"
      disabled
      value={data.displayName}
    />
    <TextField
      label="Nombre de usuario"
      disabled
      value={data.username}
    />
    <TextField
      label="¿Tiene contraseña actualmente?"
      disabled
      value={data.hasPassword ? 'Sí' : 'No'}
    />
    <PasswordField
      label="Contraseña"
      disabled={disabled}
      required
      autoFocus
      value={data.password}
      onChange={(e) => setData({...data, password: e.target.value})}
    />
  </Form>;
}