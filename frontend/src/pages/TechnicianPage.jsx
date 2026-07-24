import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { TextField, SelectField, SwitchField, ColorField } from '../components/fields/index.jsx';
import useToast from '../states/useToast.jsx';
import { getTechnician, updateTechnician, createTechnician, getTechnicianUsers } from '../services/technician.service.js';

const defaultData = {
  userUuid: '',
  phone: '',
  isActive: true,
};

export default function TechnicianPage() {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { addInfo, addError } = useToast();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({...defaultData});
  const [unchangedData, setUnchangedData] = useState({...defaultData});
  const [technicianUsers, setTechnicianUsers] = useState([]);
  const [formConfig, setFormConfig] = useState({
    title: 'Crear nuevo técnico',
    description: 'Ingrese los datos del nuevo técnico',
    disabledMessage: 'Creando técnico...',
  });

  const loadTechnicianUsers = useCallback(async () => {
    try {
      setTechnicianUsers(await getTechnicianUsers({ query: { skipTechnicians: true }}));
    } catch (error) {
      addError('Error al obtener los usuarios técnicos: ' + (error.data?.message || error.message || error.data?.error));
      console.error('Error al obtener los usuarios técnicos:', error);
    }
  }, [addError]);

  const load = useCallback(async () => {
    try {
      const res = await getTechnician(uuid);
      const data = {
        ...defaultData,
        ...res,
      };
      setData(data);
      setUnchangedData(data);
    } catch (error) {
      addError('Error al obtener el técnico: ' + (error.data?.message || error.message || error.data?.error));
      console.error('Error al obtener el técnico:', error);
    }
  }, [uuid, addError]);

  useEffect(() => {
    loadTechnicianUsers();

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
  }, [uuid, load, addError, loadTechnicianUsers]);

  async function onSubmit() {
    setDisabled(true);
    try {
      if (uuid) {
        await updateTechnician(uuid, {
          phone: data.phone,
          isActive: data.isActive,
          color: data.color,
        });
        addInfo('Técnico actualizado correctamente');
      } else {
        await createTechnician(data);
        addInfo('Técnico creado correctamente');
      }

      navigate(-1);
    } catch (error) {
      if (uuid) {
        console.error('Error al actualizar técnico:', error);
        addError('Error al actualizar técnico: ' + (error.data?.message || error.message || error.data?.error));
      } else {
        console.error('Error al crear técnico:', error);
        addError('Error al crear técnico: ' + (error.data?.message || error.message || error.data?.error));
      }
    }
    setDisabled(false);
  }

  function getValidationError() {
    if (!data.userUuid)
      return 'Debe proporcionar el usuario del técnico';

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
    <SelectField
      label="Usuario"
      disabled={disabled}
      value={data.userUuid}
      onChange={(e) => setData({...data, userUuid: e.target.value})}
      options={technicianUsers.map((user) => ({
        value: user.uuid,
        label: user.displayName || user.username,
      }))}
    />
    <TextField
      label="Teléfono"
      disabled={disabled}
      required
      value={data.phone}
      onChange={(e) => setData({...data, phone: e.target.value})}
    />
    <ColorField
      label="Color"
      disabled={disabled}
      required
      value={data.color}
      onChange={(e) => setData({...data, color: e.target.value})}
    />
  </Form>;
}