import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ReloadButton, CreateButton, PriorButton, NextButton } from './buttons';
import SelectField from './fields/SelectField';
import TextField from './fields/TextField';

export default function Month({
  title,
  description,
  tools,
  onReload,
  onCreate,
  date = new Date(),
}) {
  const weekDayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const [dates, setDates] = useState([]);
  const [effectiveDate, setEffectiveDate] = useState(date);

  useEffect(() => {
    const from = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), -effectiveDate.getDay());
    const nextDate = new Date(from);
    const dates = [];
    const currentMonth = effectiveDate.getMonth();
    const todayString = new Date().toDateString();

    for (let i = 0; i < 42; i++) {
      nextDate.setDate(nextDate.getDate() + 1);
      dates[i] = {
        date: new Date(nextDate),
        isCurrentMonth: nextDate.getMonth() === currentMonth,
        isToday: nextDate.toDateString() === todayString,
      };
    }

    setDates(dates);
  }, [effectiveDate]);

  function getMonthName(monthIndex) {
    return monthNames[monthIndex];
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
        options={monthNames.map((name, index) => ({ value: index, label: name }))}
        value={effectiveDate.getMonth()}
        onChange={(event) => setEffectiveDate(new Date(effectiveDate.getFullYear(), event.target.value, 1))}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-select': {
            padding: '4px 8px',
          }
        }}
      />
      
      <TextField
        value={effectiveDate.getFullYear()}
        onChange={(event) => setEffectiveDate(new Date(event.target.value, effectiveDate.getMonth(), 1))}
        type="number"
        inputProps={{ min: 1900, max: 2100 }}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-select': {
            padding: '4px 8px',
          }
        }}
      />

      <Button
        variant="text"
        onClick={() => setEffectiveDate(new Date())}
        sx={{
          textTransform: 'none',
          padding: '4px 8px',
          marginLeft: 1,
          marginRight: 1,
        }}
      >
        Hoy
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
      {dates.map((dateInfo) => (
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
                alignItems: 'center',
              }}
            >
              {dateInfo.date.getDate()}
            </Typography>
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
              width: '100%',
            }}
          >
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
}