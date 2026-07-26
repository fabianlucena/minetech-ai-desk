import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { TextField } from '../components/fields/index.jsx';
import useToast from '../states/useToast.jsx';
import { getSetting, updateSetting, createSetting } from '../services/setting.service.js';

const defaultData = {
  key: '',
  value: '',
  description: '',
};

export default function SettingPage() {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { addInfo, addError } = useToast();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({...defaultData});
  const [unchangedData, setUnchangedData] = useState({...defaultData});
  
  const [formConfig, setFormConfig] = useState({
    title: 'Crear nueva configuración',
    description: 'Ingrese los datos de la nueva configuración',
    disabledMessage: 'Creando configuración...',
  });

  const load = useCallback(async () => {
    try {
      const res = await getSetting(uuid);
      const data = {
        ...defaultData,
        ...res,
      };

      if (data.value == null)
        data.value = '';
      else if (typeof data.value !== 'string')
        data.value = JSON.stringify(data.value);

      setData(data);
      setUnchangedData(data);
    } catch (error) {
      addError('Error al obtener la configuración');
      console.error('Error al obtener la configuración:', error);
    }
  }, [uuid, addError]);

  useEffect(() => {
    if (uuid) {
      setFormConfig({
        title: 'Editar configuración',
        description: 'Modifique los datos de la configuración',
        disabledMessage: 'Actualizando configuración...',
      });

      load();
    } else {
      setFormConfig({
        title: 'Crear nueva configuración',
        description: 'Por favor, ingrese los datos de la nueva configuración',
        disabledMessage: 'Creando configuración...',
      });
    }
  }, [uuid, load]);

  async function onSubmit() {
    setDisabled(true);
    try {
      let value = data.value;
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          // Mantener como string si no es JSON válido
        }
      }

      if (uuid) {
        await updateSetting(uuid, {
          key: data.key,
          value,
          description: data.description,
        });
        addInfo('Configuración actualizada correctamente');
      } else {
        await createSetting({ ...data, value });
        addInfo('Configuración creada correctamente');
      }

      navigate(-1);
    } catch (error) {
      if (uuid) {
        console.error('Error al actualizar configuración:', error);
        addError('Error al actualizar configuración: ' + (error.data?.message || error.message || error.data?.error));
      } else {
        console.error('Error al crear configuración:', error);
        addError('Error al crear configuración: ' + (error.data?.message || error.message || error.data?.error));
      }
    }
    setDisabled(false);
  }

  function getValidationError() {
    if (!data.key)
      return 'Debe proporcionar una clave';

    if (!data.value)
      return 'Debe proporcionar un valor';
  }

  return <Form
    disabled={disabled}
    onSubmit={onSubmit}
    onCancelGoBack={true}
    validationError={getValidationError()}
    unchangedData={JSON.stringify(data) === JSON.stringify(unchangedData)}
    {...formConfig}
  >
    <TextField
      label="Clave"
      disabled={disabled}
      required
      autoFocus
      value={data.key}
      onChange={(e) => setData({...data, key: e.target.value})}
    />
    <TextField
      label="Valor"
      disabled={disabled}
      required
      value={data.value}
      onChange={(e) => setData({...data, value: e.target.value})}
    />
    <TextField
      label="Descripción"
      disabled={disabled}
      value={data.description}
      onChange={(e) => setData({...data, description: e.target.value})}
    />
  </Form>;
}