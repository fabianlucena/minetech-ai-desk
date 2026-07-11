import { useState, useEffect } from 'react';
import FormDialog from './FormDialog.jsx';
import SelectField from './fields/SelectField.jsx';
import TextField from './fields/TextField.jsx';
import DateTimeField from './fields/DateTimeField.jsx';
import SliderField from './fields/SliderField.jsx';
import { useToast } from '../state/toast.jsx';
import { diffHours, addHours } from '../utils/time.js';
import { getTechnicians, getTypes, getShift, createShift, updateShift } from '../services/shift.service.js';

const defaultData = {
  technicianUuid: '',
  type: 'primary',
  startDate: '',
  endDate: '',
};

export default function ShiftDialog({
  uuid = null,
  startDate = null,
  onSubmit,
  ...rest
}) {
  const [technicians, setTechnicians] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({});
  const [unchangedData, setUnchangedData] = useState({...defaultData});
  const { addInfo, addError } = useToast();

  useEffect(() => {
    if (uuid) {
      loadShift();
    } else {
      const data = {
        ...defaultData,
        startDate,
        endDate: startDate ? addHours(startDate, 8) : null,
      };

      setData(data);
      setUnchangedData(data);
    }
  }, [uuid, startDate]);

  async function loadShift() {
    if (uuid) {
      const data = await getShift(uuid);
      data.technicianUuid ??= data.technician?.uuid;
      
      setData({...data});
      setUnchangedData({...data});
    }
  }

  async function loadTechnicians() {
    const techniciansData = await getTechnicians();
    setTechnicians(techniciansData);
  }

  async function loadShiftTypes() {
    const shiftTypesData = await getTypes();
    setShiftTypes(shiftTypesData);
  }

  useEffect(() => {
    loadTechnicians();
    loadShiftTypes();
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
        await updateShift(uuid, data);
        addInfo('Turno actualizado correctamente');
      } else {
        await createShift(data);
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
      options={shiftTypes.map(t => ({ value: t.value, label: t.name }))}
    />

    <DateTimeField
      label="Fecha de inicio"
      value={data.startDate || ''}
      onChangeDate={({ date }) => {
        const newData = { ...data, startDate: date };
        if (newData.endDate < newData.startDate)
          newData.endDate = newData.startDate;

        setData({ ...newData });
      }}
    />

    <DateTimeField
      label="Fecha de finalización"
      value={data.endDate || ''}
      onChangeDate={({ date }) => {
        const newData = { ...data, endDate: date };
        if (newData.endDate < newData.startDate)
          newData.startDate = newData.endDate;

        setData({ ...newData });
      }}
    />

    <SliderField
      label={"Horas: " + (diffHours(data.startDate, data.endDate) || 0)}
      value={diffHours(data.startDate, data.endDate) || 0}
      onChange={(e, value) => {
        const newData = { ...data, endDate: addHours(data.startDate, value) };
        if (newData.endDate < newData.startDate)
          newData.endDate = newData.startDate;

        setData({ ...newData });
      }}
      min={0}
      max={12}
      step={1}
    />
  </FormDialog>;
}