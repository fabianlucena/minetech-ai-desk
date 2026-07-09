import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import TurnDialog from '../components/TurnDialog';
import { getTurns } from '../services/turn.service.js';

export default function Turns() {
  const [turns, setTurns] = useState([]);
  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);
  const [openTurnDialog, setOpenTurnDialog] = useState(false);
  const [turnDialogUuid, setTurnDialogUuid] = useState(null);
  const [turnDialogStartDate, setTurnDialogStartDate] = useState(null);

  async function load() {
    if (!firstDate || !lastDate)
      return;

    const turns = await getTurns({ query: {
      fromDay: firstDate.toISOString().split('T')[0], 
      toDay: lastDate.toISOString().split('T')[0]
    }});
    setTurns(turns);
  }

  useEffect(() => {
    load();
  }, [firstDate, lastDate]);

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
      onSubmit={() => load()}
    />

    <Calendar
      title="Turnos"
      events={turns}
      onReload={() => load()}
      onCreate={createTurnHandler}
      onFirstDate={setFirstDate}
      onLastDate={setLastDate}
    />
  </>;
}