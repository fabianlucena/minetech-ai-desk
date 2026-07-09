import { useState } from 'react';
import Calendar from '../components/Calendar';
import TurnDialog from '../components/TurnDialog';

export default function Turns() {
  const [open, setOpen] = useState(false);
  const [turnDialogTitle, setTurnDialogTitle] = useState('Turno');
  const [turnData, setTurnData] = useState({});

  function createTurnHandler({date}) {
    setTurnDialogTitle('Crear Turno');
    setOpen(true);
    setTurnData({
      startDate: date,
      endDate: (new Date()).setTime(date.getTime() + 28800000), // 8 hours later
    });
  }

  return <>
    <TurnDialog
      open={open}
      setOpen={setOpen}
      title={turnDialogTitle}
      onClose={() => setOpen(false)}
      turnData={turnData}
      setTurnData={setTurnData}
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