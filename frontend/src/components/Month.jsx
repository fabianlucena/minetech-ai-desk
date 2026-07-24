import { useState, useEffect, useMemo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ReloadButton, CreateButton, PriorButton, NextButton, EditButton, DeleteButton, RestoreButton } from './buttons';
import { ArrowBackIcon, ArrowForwardIcon } from './icons';
import SelectField from './fields/SelectField';
import TextField from './fields/TextField';
import ConfirmDialog from './dialogs/ConfirmDialog.jsx';

function getEventsToDateEntries(dateEntries, events) {
  for (const event of events) {
    event.startTimeStampMS = event.start.getTime();
    event.endTimeStampMS = event.end.getTime();
  }

  const dateEntriesWithEvents = dateEntries.map(dateEntry => ({
    ...dateEntry,
    events: events.filter(event => event.startTimeStampMS <= dateEntry.toTimeStampMS 
      && event.endTimeStampMS >= dateEntry.fromTimeStampMS)
      .map(event => ({
        ...event,
        fromPreviousDay: event.startTimeStampMS < dateEntry.fromTimeStampMS,
        toNextDay: event.endTimeStampMS > dateEntry.toTimeStampMS,
      })),
  }));

  return dateEntriesWithEvents;
}

const weekDayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function Month({
  title,
  description,
  tools,
  onReload,
  onCreate,
  onDelete,
  onEdit,
  onRestore,
  events = [],
  date = new Date(),
  onFirstDate,
  onLastDate,
  deleteConfirmationMessage = '¿Está seguro de que desea eliminar este elemento?',
}) {
  const [dateEntries, setDateEntries] = useState([]);
  const [effectiveDate, setEffectiveDate] = useState(date);
  const [confirmation, setConfirmation] = useState({
    open: false,
    onClose: () => setConfirmation({...confirmation, open: false}),
    title: 'Confirmar',
    content: '',
  });

  useEffect(() => {
    const firstDayOfMonth = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), 1);
    const from = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), -firstDayOfMonth.getDay());
    const date = new Date(from);
    const currentMonth = effectiveDate.getMonth();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayTimeStampMS = today.getTime();
    const dateDuration = 24 * 60 * 60 * 1000 - 1;
    
    const dateEntries = [];
    for (let i = 0; i < 42; i++) {
      date.setDate(date.getDate() + 1);
      const timeStampMS = date.getTime();
      dateEntries[i] = {
        date: new Date(date),
        isCurrentMonth: date.getMonth() === currentMonth,
        isPreviousDay: timeStampMS < todayTimeStampMS,
        isToday: timeStampMS === todayTimeStampMS,
        fromTimeStampMS: timeStampMS,
        toTimeStampMS: timeStampMS + dateDuration,
      };
    }

    setDateEntries(dateEntries);
    onFirstDate?.(dateEntries[0].date);
    onLastDate?.(dateEntries[dateEntries.length - 1].date);
  }, [effectiveDate, onFirstDate, onLastDate]);

  const dateEntriesWithEvents = useMemo(() => {
    if (dateEntries.length === 0)
      return [];

    return getEventsToDateEntries(dateEntries, events);
  }, [events, dateEntries]);

  function deleteHandler(event, eventInfo) {
    if (!onDelete)
      return;

    if (!deleteConfirmationMessage) {
      onDelete({ event, eventInfo });
      return;
    }

    setConfirmation({
      ...confirmation,
      open: true,
      title: 'Confirmar eliminación',
      content: deleteConfirmationMessage,
      onConfirm: () => onDelete({ event, eventInfo }),
    });
  }

  function getEventCapability(event, capability, defaultValue = false) {
    if (!event || !capability)
      return false;

    let result = event[capability];
    if (result === undefined || result === null)
      return defaultValue;

    if (typeof result === 'function')
      result = result(event);

    return !!result;
  }

  return <Box
    sx={{
      minHeight: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible',
    }}
  >
    <ConfirmDialog {...confirmation} />

    {(title || description || tools || onReload) && <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        {title && <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>}
        {description && <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>}
      </Box>
      {(tools || onReload) && <Box sx={{ marginTop: 1 }}>
        {tools}
        {onReload && <ReloadButton onClick={onReload} />}
      </Box>}
    </Box>}

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}
    >
      <PriorButton
        onClick={() => setEffectiveDate(new Date(effectiveDate.getFullYear(), effectiveDate.getMonth() - 1, 1))}
      />

      <SelectField
        variant="standard"
        options={monthNames.map((name, index) => ({ value: index, label: name }))}
        value={effectiveDate.getMonth()}
        onChange={(event) => setEffectiveDate(new Date(effectiveDate.getFullYear(), event.target.value, 1))}
        sx={{ width: 120 }}
      />
      
      <TextField
        variant="standard"
        value={effectiveDate.getFullYear()}
        onChange={(event) => setEffectiveDate(new Date(event.target.value, effectiveDate.getMonth(), 1))}
        type="number"
        sx={{ width: 80 }}
      />

      <Button
        variant="contained"
        onClick={() => setEffectiveDate(new Date())}
      >
        Ir a Hoy
      </Button>

      <NextButton
        onClick={() => setEffectiveDate(new Date(effectiveDate.getFullYear(), effectiveDate.getMonth() + 1, 1))}
      />
    </Box>
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1,
        backgroundColor: '#696969',
        padding: 1,
        overflow: 'visible',
      }}
    >
      {weekDayNames.map((day, i) => (
        <Box
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#bdbdbd',
            minHeight: 30,
            padding: 4,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {day}
          </Typography>
        </Box>
      ))}
      {dateEntriesWithEvents.map((dateEntry) => (
        <Box
          key={dateEntry.date.toISOString()}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 100,
            padding: 0,
            backgroundColor: dateEntry.isCurrentMonth ?
              dateEntry.isToday ? '#e3e8f8' :
              dateEntry.isPreviousDay ? '#e8e8e8' :
              '#f8f8f8' :
              '#dadada',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: dateEntry.isToday ? 600 : 400,
                  padding: '0 6px',
                  backgroundColor: dateEntry.isToday ? '#1976d2' : 'transparent',
                  color: dateEntry.isToday ? '#fff' : dateEntry.isCurrentMonth ? 'inherit' : '#808080',
                  borderRadius: '50%',
                  margin: 'auto',
                }}
              >
                {dateEntry.date.getDate()}
              </Typography>
            </Box>
            {onCreate && (
              <CreateButton
                sx={{
                  margin: 0,
                  padding: 0,
                }}
                onClick={event => {
                  onCreate?.({event, date: dateEntry.date});
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              width: '100%',
            }}
          >
            {dateEntry.events?.map((eventInfo, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: eventInfo.color || '#bcd5ec',
                  margin: '.1em .2em',
                  padding: '.1em .2em',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'start',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 12,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  {eventInfo.fromPreviousDay && <ArrowBackIcon title="Evento de día anterior" sx={{ fontSize: 16, color: '#606060' }} />}
                  {eventInfo.title}
                  {eventInfo.toNextDay && <ArrowForwardIcon title="Evento de día siguiente" sx={{ fontSize: 16, color: '#606060' }} />}
                </Typography>
                {onRestore && getEventCapability(eventInfo, 'canRestore', eventInfo.isDeleted) && <RestoreButton
                  size="small"
                  onClick={event => onRestore({ event, eventInfo })}
                />}
                {onEdit && getEventCapability(eventInfo, 'canEdit', !eventInfo.isDeleted) && <EditButton
                  size="small"
                  onClick={event => onEdit({ event, eventInfo })}
                />}
                {onDelete && getEventCapability(eventInfo, 'canDelete', !eventInfo.isDeleted) && <DeleteButton
                  size="small"
                  onClick={event => deleteHandler(event, eventInfo)}
                />}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
}