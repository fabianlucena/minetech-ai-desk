import { useState, useEffect } from 'react';
import FormDialog from './FormDialog';
import SelectField from './fields/SelectField';
import TextField from './fields/TextField';
import DateTimeField from './fields/DateTimeField';
import SliderField from './fields/SliderField';
import { getTechnicians, getTypes } from '../services/turn.service.js';
import { diffHours, addHours } from '../utils/time.js';

export default function TurnDialog({
  title = 'Turno',
  data = {},
  setData = () => {},
  ...rest
}) {
  const [technicians, setTechnicians] = useState([]);
  const [turnTypes, setTurnTypes] = useState([]);

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

  return <FormDialog
    title={title}
    validationError={getValidationError()}
    onCancel={() => {
      setData({});
    }}
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