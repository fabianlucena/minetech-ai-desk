import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { TextField, SwitchField, PasswordField, ChippedCheckboxSelectField } from '../components/fields/index.jsx';
import { useToast } from '../state/toast.jsx';
import { getUser, getRoles, updateUser, createUser } from '../services/user.service.js';

export default function UserPage() {
  const defaultData = {
    username: '',
    displayName: '',
    isActive: true,
    canLogin: false,
    password: '',
    roles: [],
  };

  const navigate = useNavigate();
  const { uuid } = useParams();
  const { addInfo, addError } = useToast();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({...defaultData});
  const [unchangedData, setUnchangedData] = useState({...defaultData});
  const [roles, setRoles] = useState([]);
  
  const [formConfig, setFormConfig] = useState({
    title: 'Crear nuevo usuario',
    description: 'Ingrese los datos del nuevo usuario',
    disabledMessage: 'Creando usuario...',
  });

  async function loadRoles() {
    try {
      setRoles(await getRoles());
    } catch (error) {
      addError('Error al obtener los roles: ' + (error.data?.message || error.message || error.data?.error));
      console.error('Error al obtener los roles:', error);
    }
  }

  async function load() {
    try {
      const res = await getUser(uuid);
      const data = {
        ...defaultData,
        ...res,
        roles: res.roles.map(role => role.uuid) || [],
      };
      setData(data);
      setUnchangedData(data);
    } catch (error) {
      addError('Error al obtener el usuario');
      console.error('Error al obtener el usuario:', error);
    }
  }

  useEffect(() => {
    loadRoles();

    if (uuid) {
      setFormConfig({
        title: 'Editar usuario',
        description: 'Modifique los datos del usuario',
        disabledMessage: 'Actualizando usuario...',
      });

      load();
    } else {
      setFormConfig({
        title: 'Crear nuevo usuario',
        description: 'Por favor, ingrese los datos del nuevo usuario',
        disabledMessage: 'Creando usuario...',
      });
    }
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  async function onSubmit() {
    setDisabled(true);
    try {
      if (uuid) {
        await updateUser(uuid, {
          username: data.username,
          displayName: data.displayName,
          isActive: data.isActive,
          canLogin: data.canLogin,
          lastLoginAt: data.lastLoginAt,
          password: data.password,
          roles: data.roles,
        });
        addInfo('Usuario actualizado correctamente');
      } else {
        await createUser(data);
        addInfo('Usuario creado correctamente');
      }

      navigate(-1);
    } catch (error) {
      if (uuid) {
        console.error('Error al actualizar usuario:', error);
        addError('Error al actualizar usuario: ' + (error.data?.message || error.message || error.data?.error));
      } else {
        console.error('Error al crear usuario:', error);
        addError('Error al crear usuario: ' + (error.data?.message || error.message || error.data?.error));
      }
    }
    setDisabled(false);
  }

  function getValidationError() {
    if (!data.displayName)
      return 'Debe proporcionar un nombre completo'

    if (!data.username)
      return 'Debe proporcionar un nombre de usuario';
  }

  return <Form
    disabled={disabled}
    onSubmit={onSubmit}
    onCancelGoBack={true}
    validationError={getValidationError()}
    unchangedData={JSON.stringify(data) === JSON.stringify(unchangedData)}
    {...formConfig}
  >
    <SwitchField
      label="Activo"
      disabled={disabled}
      checked={data.isActive}
      onChange={(e) => setData({...data, isActive: e.target.checked})}
    />
    <TextField
      label="Nombre completo"
      disabled={disabled}
      required
      autoFocus
      value={data.displayName}
      onChange={(e) => setData({...data, displayName: e.target.value})}
    />
    <TextField
      label="Nombre de usuario"
      disabled={disabled}
      required
      value={data.username}
      onChange={(e) => setData({...data, username: e.target.value})}
    />
    <SwitchField
      label="Permitir inicio de sesión"
      disabled={disabled}
      checked={data.canLogin}
      onChange={(e) => setData({...data, canLogin: e.target.checked})}
    />
    {!uuid && data.canLogin && <PasswordField
      label="Contraseña"
      disabled={disabled}
      required={data.canLogin}
      value={data.password}
      showHidePassword
      onChange={(e) => setData({...data, password: e.target.value})}
    />}
    <ChippedCheckboxSelectField
      label="Roles"
      disabled={disabled}
      value={data.roles}
      multiple
      onChange={(e) => setData({...data, roles: e.target.value})}
      options={roles.map((role) => ({
        value: role.uuid,
        label: role.title,
      }))}
    />
  </Form>;
}