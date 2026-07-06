import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { TextField, SwitchField, PasswordField, ChippedCheckboxSelectField } from '../components/fields/index.jsx';
import { useToast } from '../state/toast.jsx';
import { getTechnician, updateTechnician, createTechnician } from '../services/technician.service.js';

export default function Technician() {
  const defaultData = {
    fullName: '',
    phone: '',
    isActive: true,
  };

  const navigate = useNavigate();
  const { uuid } = useParams();
  const { addInfo, addError } = useToast();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({...defaultData});
  const [unchangedData, setUnchangedData] = useState({...defaultData});
  
  const [formConfig, setFormConfig] = useState({
    title: 'Crear nuevo técnico',
    description: 'Ingrese los datos del nuevo técnico',
    disabledMessage: 'Creando técnico...',
  });

  async function load() {
    try {
      const res = await getTechnician(uuid);
      const data = {
        ...defaultData,
        ...res,
      };
      setData(data);
      setUnchangedData(data);
    } catch (error) {
      addError('Error al obtener el técnico');
      console.error('Error al obtener el técnico:', error);
    }
  }

  useEffect(() => {
    if (uuid) {
      setFormConfig({
        title: 'Editar técnico',
        description: 'Modifique los datos del técnico',
        disabledMessage: 'Actualizando técnico...',
      });

      load();
    } else {
      setFormConfig({
        title: 'Crear nuevo técnico',
        description: 'Por favor, ingrese los datos del nuevo técnico',
        disabledMessage: 'Creando técnico...',
      });
    }
  }, [uuid]);

  async function onSubmit() {
    setDisabled(true);
    try {
      if (uuid) {
        await updateTechnician(uuid, data);
        addInfo('Técnico actualizado correctamente');
      } else {
        await createTechnician(data);
        addInfo('Técnico creado correctamente');
      }

      navigate(-1);
    } catch (error) {
      if (uuid) {
        console.error('Error al actualizar técnico:', error);
        addError('Error al actualizar técnico');
      } else {
        console.error('Error al crear técnico:', error);
        addError('Error al crear técnico');
      }
    }
    setDisabled(false);
  }

  function getValidationError() {
    if (!data.fullName)
      return 'Debe proporcionar el nombre completo del técnico';

    if (!data.phone)
      return 'Debe proporcionar el número de teléfono del técnico';
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
      value={data.fullName}
      onChange={(e) => setData({...data, fullName: e.target.value})}
    />
    <TextField
      label="Teléfono"
      disabled={disabled}
      required
      value={data.phone}
      onChange={(e) => setData({...data, phone: e.target.value})}
    />
  </Form>;
}