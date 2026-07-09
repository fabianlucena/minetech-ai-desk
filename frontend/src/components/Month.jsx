import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ReloadButton, CreateButton, PriorButton, NextButton, EditButton, DeleteButton } from './buttons';
import SelectField from './fields/SelectField';
import TextField from './fields/TextField';
import ConfirmDialog from './ConfirmDialog.jsx';

function addEventsToDatesInfo(datesInfo, events) {
  for (const dateInfo of datesInfo) {
    const date = dateInfo.date;
    dateInfo.events = events.filter(event => {
      const eventStartDate = new Date(event.startDate);
      if (eventStartDate.toDateString() === date.toDateString())
        return true;
      
      const eventEndDate = new Date(event.endDate);
      if (eventEndDate.toDateString() === date.toDateString())
        return true;

      if (eventStartDate.toDateString() < date.toDateString() && eventEndDate.toDateString() > date.toDateString())
        return true;
    });
  };
}

export default function Month({
  title,
  description,
  tools,
  onReload,
  onCreate,
  onDelete,
  onEdit,
  events = [],
  date = new Date(),
  onFirstDate,
  onLastDate,
  deleteConfirmationMessage = '¿Está seguro de que desea eliminar este elemento?',
}) {
  const weekDayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const [datesInfo, setDatesInfo] = useState([]);
  const [effectiveDate, setEffectiveDate] = useState(date);
  const [confirmation, setConfirmation] = useState({
    open: false,
    onClose: () => setConfirmation({...confirmation, open: false}),
    title: 'Confirmar',
    message: '',
  });

  useEffect(() => {
    const from = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), -effectiveDate.getDay());
    const nextDate = new Date(from);
    const datesInfo = [];
    const currentMonth = effectiveDate.getMonth();
    const todayString = new Date().toDateString();

    for (let i = 0; i < 42; i++) {
      nextDate.setDate(nextDate.getDate() + 1);
      datesInfo[i] = {
        date: new Date(nextDate),
        isCurrentMonth: nextDate.getMonth() === currentMonth,
        isToday: nextDate.toDateString() === todayString,
      };
    }

    addEventsToDatesInfo(datesInfo, events);
    setDatesInfo(datesInfo);
    onFirstDate?.(datesInfo[0].date);
    onLastDate?.(datesInfo[datesInfo.length - 1].date);
  }, [effectiveDate]);

  useEffect(() => {
    if (datesInfo.length === 0)
      return;
      
    addEventsToDatesInfo(datesInfo, events);
    setDatesInfo([...datesInfo]);
  }, [events]);

  function getMonthName(monthIndex) {
    return monthNames[monthIndex];
  }

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
      message: deleteConfirmationMessage,
      onConfirm: () => onDelete({ event, eventInfo }),
    });
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
      {datesInfo.map((dateInfo) => (
        <Box
          key={dateInfo.date.toISOString()}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
            minHeight: 100,
            padding: 0,
            backgroundColor: dateInfo.isCurrentMonth ? '#f5f5f5' : '#e8e8e8',
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
                  fontWeight: dateInfo.isToday ? 600 : 400,
                  padding: '0 6px',
                  backgroundColor: dateInfo.isToday ? '#1976d2' : 'transparent',
                  color: dateInfo.isToday ? '#fff' : dateInfo.isCurrentMonth ? 'inherit' : '#808080',
                  borderRadius: '50%',
                  margin: 'auto',
                }}
              >
                {dateInfo.date.getDate()}
              </Typography>
            </Box>
            {onCreate && (
              <CreateButton
                sx={{
                  margin: 0,
                  padding: 0,
                }}
                onClick={event => {
                  onCreate?.({event, date: dateInfo.date});
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
            {dateInfo.events?.map((eventInfo, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: eventInfo.technician.color,
                  margin: '.1em .2em',
                  padding: '.1em .2em',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2" sx={{ fontSize: 12, flex: 1 }}>
                  {eventInfo.startDate.getHours?.().toString().padStart(2, '0')}h 
                  {eventInfo.technician.fullName}
                </Typography>
                {onEdit && <EditButton
                  size="small"
                  onClick={event => onEdit({ event, eventInfo })}
                />}
                {onDelete && <DeleteButton
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