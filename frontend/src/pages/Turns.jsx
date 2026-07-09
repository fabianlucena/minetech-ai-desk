import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import TurnDialog from '../components/TurnDialog';
import { getTurns } from '../services/turn.service.js';

export default function Turns() {
  const [turns, setTurns] = useState([]);
  const [openTurnDialog, setOpenTurnDialog] = useState(false);
  const [turnDialogUuid, setTurnDialogUuid] = useState(null);
  const [turnDialogStartDate, setTurnDialogStartDate] = useState(null);

  async function load() {
    const turns = await getTurns();
    setTurns(turns);
  }

  useEffect(() => {
    load();
  }, []);

  function createTurnHandler({date}) {
    setTurnDialogUuid(null);
    setTurnDialogStartDate(date);
    setOpenTurnDialog(true);
  }

  return <>
    <TurnDialog
      uuid={turnDialogUuid}
      startDate={turnDialogStartDate}
      open={openTurnDialog}
      onClose={() => setOpenTurnDialog(false)}
    />

    <Calendar
      title="Turnos"
      onReload={() => load()}
      onCreate={createTurnHandler}
    />
  </>;
}