import { useState, useEffect } from 'react';
import Dialog from './Dialog';
import SelectField from './fields/SelectField';
import TextField from './fields/TextField';
import { getTechnicians, getTypes } from '../services/turn.service.js';

export default function TurnDialog({
  title = 'Turno',
  data = {},
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

  return <Dialog
    title={title}
    {...rest}
  >
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }}>
      <SelectField 
        label="Técnico"
        value={data.technicianId || ''}
        onChange={(e) => setData({ ...data, technicianId: e.target.value })}
        options={technicians.map(t => ({ value: t.id, label: t.name }))}
      />

      <SelectField 
        label="Tipo"
        value={data.type || ''}
        onChange={(e) => setData({ ...data, type: e.target.value })}
        options={turnTypes.map(t => ({ value: t.id, label: t.name }))}
      />

      <TextField
        label="Fecha de inicio"
        type="datetime-local"
        value={data.startDate || ''}
        onChange={(e) => setData({ ...data, startDate: e.target.value })}
      />

      <TextField
        label="Fecha de finalización"
        type="datetime-local"
        value={data.endDate || ''}
        onChange={(e) => setData({ ...data, endDate: e.target.value })}
      />
    </form>
  </Dialog>;
}
