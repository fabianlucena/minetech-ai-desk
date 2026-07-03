import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { TextField, SwitchField, PasswordField, CheckboxSelectField } from '../components/fields';
import { useToast } from '../state/toast.jsx';

export default function User() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreation = location.pathname === '/users/new';
  const { addInfo, addError } = useToast();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({
    username: '',
    displayName: '',
    isActive: true,
    canLogin: false,
    password: '',
    roles: [],
  });
  const [formConfig, setFormConfig] = useState({
    title: 'Crear nuevo usuario',
    description: 'Por favor, ingrese los datos del nuevo usuario',
    disabledMessage: 'Creando usuario...',
  });

  useEffect(() => {
    if (isCreation) {
      setFormConfig({
        title: 'Crear nuevo usuario',
        description: 'Por favor, ingrese los datos del nuevo usuario',
        disabledMessage: 'Creando usuario...',
      });
    } else {
      setFormConfig({
        title: 'Editar usuario',
        description: 'Por favor, modifique los datos del usuario',
        disabledMessage: 'Actualizando usuario...',
      });
      addError('Falta cargar los datos del usuario para editar');
    }
  }, [isCreation]);

  async function onSubmit() {
    setDisabled(true);
    try {
      addError('No implementado');

      //navigate(-1);
      //addInfo('Usuario creado correctamente');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      addError('Error al crear usuario');
    }
    setDisabled(false);
  }

  return <Form
    disabled={disabled}
    onSubmit={onSubmit}
    onCancelGoBack={true}
    {...formConfig}
  >
    <SwitchField
      label="Activo"
      disabled={disabled}
      checked={data.isActive}
      onChange={(e) => setData({...data, isActive: e.target.checked})}
    />
    <TextField
      label="Nombre de usuario"
      disabled={disabled}
      required
      autoFocus
      value={data.username}
      onChange={(e) => setData({...data, username: e.target.value})}
    />
    <TextField
      label="Nombre completo"
      disabled={disabled}
      required
      value={data.displayName}
      onChange={(e) => setData({...data, displayName: e.target.value})}
    />
    <SwitchField
      label="Permitir inicio de sesión"
      disabled={disabled}
      checked={data.canLogin}
      onChange={(e) => setData({...data, canLogin: e.target.checked})}
    />
    {data.canLogin && <PasswordField
      label="Contraseña"
      disabled={disabled}
      required={data.canLogin}
      value={data.password}
      onChange={(e) => setData({...data, password: e.target.value})}
    />}
    <CheckboxSelectField
      label="Roles"
      disabled={disabled}
      value={data.roles}
      onChange={(e) => setData({...data, roles: e.target.value})}
      options={[
        { value: 'admin', label: 'Administrador' },
        { value: 'supervisor', label: 'Supervisor' },
        { value: 'operator', label: 'Operador' },
      ]}
    />
  </Form>;
}