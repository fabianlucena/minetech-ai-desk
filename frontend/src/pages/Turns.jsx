import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import TurnDialog from '../components/TurnDialog';
import { getTurns, deleteTurn } from '../services/turn.service.js';
import { hasPermission } from '../state/global.jsx';
import { useToast } from '../state/toast.jsx';

export default function Turns() {
  const [turns, setTurns] = useState([]);
  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);
  const [openTurnDialog, setOpenTurnDialog] = useState(false);
  const [turnDialogUuid, setTurnDialogUuid] = useState(null);
  const [turnDialogStartDate, setTurnDialogStartDate] = useState(null);
  const { addMessage, addError } = useToast();

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

  async function deleteTurnHandler({ eventInfo }) {
    try {
      await deleteTurn(eventInfo.uuid);
      addMessage('Turno eliminado correctamente');
      load();
    } catch (error) {
      addError('Error al eliminar el turno');
      console.error('Error al eliminar el turno:', error);
    }
  }

  function editTurnHandler({ eventInfo }) {
    setTurnDialogUuid(eventInfo.uuid);
    setTurnDialogStartDate(new Date(eventInfo.startDate));
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
      onCreate={hasPermission('turns.create') && createTurnHandler}
      onDelete={hasPermission('turns.delete') && deleteTurnHandler}
      onEdit={hasPermission('turns.update') && editTurnHandler}
      onFirstDate={setFirstDate}
      onLastDate={setLastDate}
      deleteConfirmationMessage="¿Está seguro de que desea eliminar este turno?"
    />
  </>;
}