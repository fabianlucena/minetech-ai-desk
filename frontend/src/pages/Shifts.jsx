import { useState, useEffect } from 'react';
import Calendar from '../components/Calendar.jsx';
import ShiftDialog from '../components/ShiftDialog.jsx';
import { getShifts, deleteShift, restoreShift } from '../services/shift.service.js';
import { hasPermission } from '../state/global.jsx';
import { useToast } from '../state/toast.jsx';
import SwitchField from '../components/fields/SwitchField.jsx';

export default function Shifts() {
  const [shifts, setShifts] = useState([]);
  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [openShiftDialog, setOpenShiftDialog] = useState(false);
  const [shiftDialogUuid, setShiftDialogUuid] = useState(null);
  const [shiftDialogStart, setShiftDialogStart] = useState(null);
  const { addMessage, addError } = useToast();

  async function load() {
    if (!firstDate || !lastDate)
      return;

    const query = {
      fromDay: firstDate.toISOString().split('T')[0], 
      toDay: lastDate.toISOString().split('T')[0],
    };

    if (includeDeleted)
      query.includeDeleted = true;

    const shifts = await getShifts({ query });
    setShifts(shifts);
  }

  useEffect(() => {
    load();
  }, [firstDate, lastDate, includeDeleted]);

  function createShiftHandler({date}) {
    setShiftDialogUuid(null);
    setShiftDialogStart(date);
    setOpenShiftDialog(true);
  }

  async function deleteShiftHandler({ eventInfo }) {
    try {
      await deleteShift(eventInfo.id);
      addMessage('Turno eliminado correctamente');
      load();
    } catch (error) {
      addError('Error al eliminar el turno');
      console.error('Error al eliminar el turno:', error);
    }
  }

  function editShiftHandler({ eventInfo }) {
    setShiftDialogUuid(eventInfo.id);
    setShiftDialogStart(new Date(eventInfo.start));
    setOpenShiftDialog(true);
  }

  async function restoreShiftHandler({ eventInfo }) {
    try {
      await restoreShift(eventInfo.id);
      addMessage('Turno restaurado correctamente');
      load();
    } catch (error) {
      addError('Error al restaurar el turno: ' + (error.data?.message || error.message || error.data?.error));
      console.error('Error al restaurar el turno:', error);
    }
  }

  return <>
    <ShiftDialog
      uuid={shiftDialogUuid}
      start={shiftDialogStart}
      open={openShiftDialog}
      onClose={() => setOpenShiftDialog(false)}
      onSubmit={() => load()}
    />

    <Calendar
      title="Turnos"
      events={shifts.map(shift => ({
        id: shift.uuid,
        start: shift.start,
        end: shift.end,
        title: shift.technician.fullName,
        color: shift.technician.color,
        isDeleted: !!shift.deletedAt,
      }))}
      onReload={() => load()}
      onCreate={hasPermission('shifts.create') && createShiftHandler}
      onDelete={hasPermission('shifts.delete') && deleteShiftHandler}
      onEdit={hasPermission('shifts.update') && editShiftHandler}
      onRestore={hasPermission('shifts.restore') && restoreShiftHandler}
      onFirstDate={setFirstDate}
      onLastDate={setLastDate}
      deleteConfirmationMessage="¿Está seguro de que desea eliminar este turno?"
      tools={<>
        {hasPermission('shifts.restore') && 
          <SwitchField
            label="Incluir eliminados"
            checked={includeDeleted}
            onChange={(e) => setIncludeDeleted(e.target.checked)}
          />
        }
      </>}
    />
  </>;
}