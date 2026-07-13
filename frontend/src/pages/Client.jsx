import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { TextField, SwitchField, PasswordField, ChippedCheckboxSelectField } from '../components/fields/index.jsx';
import { useToast } from '../state/toast.jsx';
import { getClient, getStatus, updateClient, createClient } from '../services/client.service.js';
import { generateClientIdentifiers } from '../utils/client.js';
import RenewButton from '../components/buttons/renew.button.jsx';

export default function Client() {
  const defaultData = {
    name: '',
    code: '',
    accessCode: '',
    isActive: true,
    status: 'active',
  };

  const navigate = useNavigate();
  const { uuid } = useParams();
  const { addInfo, addError } = useToast();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({...defaultData});
  const [unchangedData, setUnchangedData] = useState({...defaultData});
  const [status, setStatus] = useState([]);
  
  const [formConfig, setFormConfig] = useState({
    title: 'Crear nuevo cliente',
    description: 'Ingrese los datos del nuevo cliente',
    disabledMessage: 'Creando cliente...',
  });
  
  async function loadStatus() {
    try {
      setStatus(await getStatus());
    } catch (error) {
      addError('Error al obtener los estados');
      console.error('Error al obtener los estados:', error);
    }
  }

  async function load() {
    try {
      const res = await getClient(uuid);
      const data = {
        ...defaultData,
        ...res,
      };
      setData(data);
      setUnchangedData(data);
    } catch (error) {
      addError('Error al obtener el cliente');
      console.error('Error al obtener el cliente:', error);
    }
  }

  useEffect(() => {
    loadStatus();

    if (uuid) {
      setFormConfig({
        title: 'Editar cliente',
        description: 'Modifique los datos del cliente',
        disabledMessage: 'Actualizando cliente...',
      });

      load();
    } else {
      setFormConfig({
        title: 'Crear nuevo cliente',
        description: 'Por favor, ingrese los datos del nuevo cliente',
        disabledMessage: 'Creando cliente...',
      });
    }
  }, [uuid]);

  async function onSubmit() {
    setDisabled(true);
    try {
      if (uuid) {
        await updateClient(uuid, {
          name: data.name,
          code: data.code,
          accessCode: data.accessCode,
          status: data.status,
          isActive: data.isActive,
        });
        addInfo('Cliente actualizado correctamente');
      } else {
        await createClient(data);
        addInfo('Cliente creado correctamente');
      }

      navigate(-1);
    } catch (error) {
      if (uuid) {
        console.error('Error al actualizar cliente:', error);
        addError('Error al actualizar cliente: ' + (error.data?.message || error.message || error.data?.error));
      } else {
        console.error('Error al crear cliente:', error);
        addError('Error al crear cliente: ' + (error.data?.message || error.message || error.data?.error));
      }
    }
    setDisabled(false);
  }

  useEffect(() => {
    if (!uuid) {
      let { code, accessCode } = generateClientIdentifiers(data.name);
      if (accessCode.substring(0, 3) === data.accessCode.substring(0, 3))
        accessCode = data.accessCode;

      setData({...data, code, accessCode});
    }
  }, [data.name, uuid]);

  function getValidationError() {
    if (!data.name)
      return 'Debe proporcionar el nombre del cliente';

    if (!data.code)
      return 'Debe proporcionar el código de cliente';

    if (!data.accessCode)
      return 'Debe proporcionar el código de acceso del cliente';

    if (!data.status)
      return 'Debe seleccionar un estado para el cliente';
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
      label="Nombre"
      disabled={disabled}
      required
      autoFocus
      value={data.name}
      onChange={(e) => setData({...data, name: e.target.value})}
    />
    <TextField
      label="Código"
      disabled={disabled}
      required
      value={data.code}
      onChange={(e) => setData({...data, code: e.target.value})}
    />
    <TextField
      label="Código de acceso"
      disabled={disabled}
      required
      value={data.accessCode}
      onChange={(e) => setData({...data, accessCode: e.target.value})}
      tools={<RenewButton
        onClick={() => {
          const { accessCode } = generateClientIdentifiers(data.name);
          setData({...data, accessCode});
        }}
      />}
    />
    <ChippedCheckboxSelectField
      label="Estado"
      disabled={disabled}
      required
      value={status?.length ? data.status : ''}
      onChange={(e) => setData({...data, status: e.target.value})}
      options={status.map((status) => ({
        value: status.value,
        label: status.name,
        title: status.detail,
      }))}
    />
  </Form>;
}