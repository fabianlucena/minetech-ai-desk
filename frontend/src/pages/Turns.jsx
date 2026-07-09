import { useState } from 'react';
import Calendar from '../components/Calendar';
import TurnDialog from '../components/TurnDialog';
import { addHours } from '../utils/time.js';

const defaultTurnData = {
  technicianUuid: '',
  type: 'primary',
  startDate: '',
  endDate: '',
};

export default function Turns() {
  const [open, setOpen] = useState(false);
  const [turnDialogTitle, setTurnDialogTitle] = useState('Turno');
  const [turnData, setTurnData] = useState({});

  function createTurnHandler({date}) {
    setTurnDialogTitle('Crear Turno');
    setOpen(true);
    setTurnData({
      ...defaultTurnData,
      startDate: date,
      endDate: addHours(date, 8),
    });
  }

  return <>
    <TurnDialog
      open={open}
      setOpen={setOpen}
      title={turnDialogTitle}
      onClose={() => setOpen(false)}
      data={turnData}
      setData={setTurnData}
    />

    <Calendar
      title="Turnos"
      onReload={() => {
        console.log('Reloading turns...');
      }}
      onCreate={createTurnHandler}
    />
  </>;
}