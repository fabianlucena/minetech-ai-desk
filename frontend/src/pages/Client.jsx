import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { TextField, SwitchField, PasswordField, ChippedCheckboxSelectField } from '../components/fields/index.jsx';
import { useToast } from '../state/toast.jsx';
import { getClient, getStatus, updateClient, createClient } from '../services/client.service.js';

export default function Client() {
  const defaultData = {
    name: '',
    clientCode: '',
    token: '',
    isActive: true,
    status: '',
  };

  const navigate = useNavigate();
  const { uuid } = useParams();
  const { addInfo, addError } = useToast();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({...defaultData});
  const [unchangedData, setUnchangedData] = useState({...defaultData});
  const [status, setStatus] = useState([{label: 'uno', value: 'uno'}, {label: 'dos', value: 'dos'}, {label: 'tres', value: 'tres'}]);
  
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
        await updateClient(uuid, data);
        addInfo('Cliente actualizado correctamente');
      } else {
        await createClient(data);
        addInfo('Cliente creado correctamente');
      }

      navigate(-1);
    } catch (error) {
      if (uuid) {
        console.error('Error al actualizar cliente:', error);
        addError('Error al actualizar cliente');
      } else {
        console.error('Error al crear cliente:', error);
        addError('Error al crear cliente');
      }
    }
    setDisabled(false);
  }

  function getValidationError() {
    if (!data.name)
      return 'Debe proporcionar el nombre del cliente';

    if (!data.clientCode)
      return 'Debe proporcionar el código de cliente';

    if (!data.token)
      return 'Debe proporcionar el token del cliente';

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
      label="Código de cliente"
      disabled={disabled}
      required
      value={data.clientCode}
      onChange={(e) => setData({...data, clientCode: e.target.value})}
    />
    <TextField
      label="Token"
      disabled={disabled}
      required
      value={data.token}
      onChange={(e) => setData({...data, token: e.target.value})}
    />
    <ChippedCheckboxSelectField
      label="Estado"
      disabled={disabled}
      required
      value={data.status}
      onChange={(e) => setData({...data, status: e.target.value})}
      options={status.map((status) => ({
        value: status.value,
        label: status.name,
        title: status.detail,
      }))}
    />
  </Form>;
}