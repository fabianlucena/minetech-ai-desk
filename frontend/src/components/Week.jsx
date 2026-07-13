import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ReloadButton, CreateButton, PriorButton, NextButton, EditButton, DeleteButton, RestoreButton } from './buttons';
import SelectField from './fields/SelectField';
import TextField from './fields/TextField';
import ConfirmDialog from './ConfirmDialog.jsx';
import { getDarkerColor } from '../utils/color.js';

function splitMultiDayEvent(event) {
  const start = new Date(event.start);
  const end = new Date(event.end);

  const days = [];
  let current = new Date(start);

  while (current.toDateString() !== end.toDateString()) {
    const dayEnd = new Date(current);
    dayEnd.setHours(24, 0, 0, 0);

    days.push({
      ...event,
      start: new Date(current),
      end: (new Date()).setTime(dayEnd.getTime() - 1),
      originalId: event.id,
    });

    current = new Date(dayEnd);
  }

  days.push({
    ...event,
    start: current,
    end: end,
    originalId: event.id,
  });

  return days;
}

export default function Week({
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
    content: '',
  });
  const [now, setNow] = useState(new Date());
  const [isShowingToday, setIsShowingToday] = useState(false);
  const [normalizedEvents, setNormalizedEvents] = useState([]);

  function updateNow() {
    setNow(prev => {
      const date = new Date();
      // date.setTime(date.getTime() - 12 * 60000);
      if (prev.getDate() !== date.getDate()) {
        updateDatesInfo();
      }

      return date;
    });
  }

  function updateDatesInfo() {
    const from = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate() - effectiveDate.getDay() - 1);
    const nextDate = new Date(from);
    const datesInfo = [];
    const currentMonth = effectiveDate.getMonth();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayTimeStampMS = today.getTime();

    for (let i = 0; i < 7; i++) {
      nextDate.setDate(nextDate.getDate() + 1);
      datesInfo[i] = {
        date: new Date(nextDate),
        isCurrentMonth: nextDate.getMonth() === currentMonth,
        isToday: nextDate.getTime() === todayTimeStampMS,
        weekDayName: weekDayNames[nextDate.getDay()],
      };
    }

    setIsShowingToday(datesInfo.some(dateInfo => dateInfo.isToday));
    setDatesInfo(datesInfo);

    return datesInfo;
  }    

  useEffect(() => {
    updateNow();
    const msToNextMinute = (60 - now.getSeconds()) * 1000;

    const timeout = setTimeout(() => {
      updateNow();
      const interval = setInterval(() => {
        updateNow();
      }, 60 * 1000);

      return () => clearInterval(interval);
    }, msToNextMinute);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const datesInfo = updateDatesInfo();
    onFirstDate?.(datesInfo[0].date);
    onLastDate?.(datesInfo[datesInfo.length - 1].date);
  }, [effectiveDate]);

  useEffect(() => {
    const normalized = events.flatMap(splitMultiDayEvent);
    setNormalizedEvents(normalized);
    console.log(events, normalized);
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
      content: deleteConfirmationMessage,
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
        onClick={() => setEffectiveDate(new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate() - 7))}
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
        onClick={() => setEffectiveDate(new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate() + 7))}
      />
    </Box>

    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr repeat(7, 3fr)',
        gap: 0,
        backgroundColor: '#a1a1a1',
        overflow: 'visible',
        border: '#4b4b4b solid 1px',
      }}
    >
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#bdbdbd',
          borderBottom: '#4b4b4b solid 1px',
          minHeight: 30,
          padding: 4,
          gridArea: '1 / 1 / span 1 / span 1',
        }}
      >
        <Typography variant="body2" fontWeight={600}>
          Hora
        </Typography>
      </Box>
      {datesInfo.map((dateInfo, i) => (
        <Box
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: dateInfo.isToday ? '#70a5db': dateInfo.isCurrentMonth ? '#bdbdbd' : '#d3d3d3',
            color: dateInfo.isCurrentMonth ? '#000000' : '#8b8b8b',
            minHeight: 30,
            padding: 4,
            borderLeft: '#4b4b4b solid 1px',
            borderBottom: '#4b4b4b solid 1px',
            gridArea: `1 / ${i + 2} / span 1 / span 1`,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {dateInfo.weekDayName} {dateInfo.date.getDate() || ''}
          </Typography>
        </Box>
      ))}
      {Array(24).fill().map((_, h) => <>
        <Box
          key={h}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
            padding: 0,
            borderBottom: '#a8a8a8 dotted 1px',
            gridArea: `${h + 2} / 1 / span 1 / span 1`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              padding: '0 6px',
              borderRadius: '50%',
              margin: 'auto',
            }}
          >
            {h.toString().padStart(2, '0')}:00
          </Typography>
        </Box>
        {Array(7).fill().map((_, i) => <>
          <Box
            key={i}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#f5f5f5',
              padding: 0,
              borderLeft: '#a8a8a8 dotted 1px',
              borderBottom: '#a8a8a8 dotted 1px',
              gridArea: `${h + 2} / ${i + 2} / span 1 / span 1`,
            }}
          >
          </Box>
        </>)}
      </>)}
      {isShowingToday &&
        <div
          style={{
            gridArea: `2 / ${datesInfo.findIndex(dateInfo => dateInfo.isToday) + 2} / span 24 / span 1`,
            position: 'relative',
            paddingBottom: 1,
          }}
        >
          <div style={{
            height: (now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600) * (100 / 24) + '%',
            borderBottom: '2px solid red'
          }}>
          </div>
      </div>}
      {normalizedEvents.map((event, i) => {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const dayIndex = start.getDay();
        const startHour = start.getHours();
        const endHour = end.getHours() + (end.getMinutes() > 0 || end.getSeconds() > 0 || end.getMilliseconds() > 0 ? 1 : 0);

        return <Box
          key={i}
          style={{
            gridArea: `${startHour + 2} / ${dayIndex + 2} / span ${endHour - startHour} / span 1`,
            backgroundColor: `${event.technician.color}40`,
            border: `2px solid ${getDarkerColor(event.technician.color)}`,
            borderRadius: 4,
            padding: 4,
          }}
        >
          {event.technician.fullName}
          - {start.getDay()}
          - {start.getHours?.().toString().padStart(2, '0')}h
          - {end.getHours?.().toString().padStart(2, '0')}h
        </Box>;
      })}
    </Box>
  </Box>
}