import { useState, useEffect } from 'react';
import FormDialog from './FormDialog';
import SelectField from './fields/SelectField';
import TextField from './fields/TextField';
import DateTimeField from './fields/DateTimeField';
import SliderField from './fields/SliderField';
import { useToast } from '../state/toast.jsx';
import { diffHours, addHours } from '../utils/time.js';
import { getTechnicians, getTypes, getTurn, createTurn, updateTurn } from '../services/turn.service.js';

const defaultData = {
  technicianUuid: '',
  type: 'primary',
  startDate: '',
  endDate: '',
};

export default function TurnDialog({
  uuid = null,
  startDate = null,
  onSubmit,
  ...rest
}) {
  const [technicians, setTechnicians] = useState([]);
  const [turnTypes, setTurnTypes] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({});
  const [unchangedData, setUnchangedData] = useState({...defaultData});
  const { addInfo, addError } = useToast();

  useEffect(() => {
    if (uuid) {
      loadTurn();
    } else {
      const data = {
        ...defaultData,
        startDate,
        endDate: addHours(startDate, 8),
      };

      setData(data);
      setUnchangedData(data);
    }
  }, [uuid, startDate]);

  async function loadTurn() {
    if (uuid) {
      const data = await getTurn(uuid);
      data.technicianUuid ??= data.technician?.uuid;
      
      setData({...data});
      setUnchangedData({...data});
    }
  }

  async function loadTechnicians() {
    const techniciansData = await getTechnicians();
    setTechnicians(techniciansData);
  }

  async function loadTurnTypes() {
    const turnTypesData = await getTypes();
    setTurnTypes(turnTypesData);
  }

  useEffect(() => {
    loadTechnicians();
    loadTurnTypes();
  }, []);

  function getValidationError() {
    if (!data.technicianUuid)
      return 'Debe seleccionar un técnico'

    if (!data.type)
      return 'Debe seleccionar un tipo de turno';

    if (!data.startDate)
      return 'Debe seleccionar una fecha de inicio';

    if (!data.endDate)
      return 'Debe seleccionar una fecha de finalización';
  }

  async function onSubmitHandler() {
    setDisabled(true);
    try {
      if (uuid) {
        await updateTurn(uuid, data);
        addInfo('Turno actualizado correctamente');
      } else {
        await createTurn(data);
        addInfo('Turno creado correctamente');
      }
    } catch (error) {
      if (uuid) {
        console.error('Error al actualizar turno:', error);
        addError('Error al actualizar turno');
      } else {
        console.error('Error al crear turno:', error);
        addError('Error al crear turno');
      }
    }
    setDisabled(false);

    onSubmit?.();
  }

  return <FormDialog
    title={uuid ? 'Modificar Turno' : 'Crear Turno'}
    disabled={disabled}
    validationError={getValidationError()}
    unchangedData={JSON.stringify(data) === JSON.stringify(unchangedData)}
    onSubmit={onSubmitHandler}
    {...rest}
  >
    <SelectField 
      label="Técnico"
      value={data.technicianUuid || ''}
      onChange={(e) => setData({ ...data, technicianUuid: e.target.value })}
      options={technicians.map(t => ({ value: t.uuid, label: t.fullName }))}
    />

    <SelectField 
      label="Tipo"
      value={data.type || ''}
      onChange={(e) => setData({ ...data, type: e.target.value })}
      options={turnTypes.map(t => ({ value: t.value, label: t.name }))}
    />

    <DateTimeField
      label="Fecha de inicio"
      value={data.startDate || ''}
      onChange={(e) => setData({ ...data, startDate: e.target.value })}
      
    />

    <DateTimeField
      label="Fecha de finalización"
      value={data.endDate || ''}
      onChange={(e) => setData({ ...data, endDate: e.target.value })}
    />

    <SliderField
      label={"Horas: " + (diffHours(data.startDate, data.endDate) || 0)}
      value={diffHours(data.startDate, data.endDate) || 0}
      onChange={(e, value) => setData({ ...data, endDate: addHours(data.startDate, value) })}
      min={0}
      max={12}
      step={1}
    />
  </FormDialog>;
}