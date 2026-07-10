import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ReloadButton, CreateButton, MonthButton, WeekButton } from './buttons';
import Month from './Month';
import Week from './Week';

export default function Calendar({
  title,
  description,
  events,
  tools,
  onReload,
  onCreate,
  onDelete,
  onEdit,
  onRestore,
  onFirstDate,
  onLastDate,
  deleteConfirmationMessage,
}) {
  const [type, setType] = useState('month');

  return <Box
    sx={{
      height: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    }}
  >
    {(title || description || tools || onReload || onCreate) && <Box
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
      {(tools || onReload || onCreate || true) && <Box sx={{ marginTop: 1 }}>
        {tools}
        {onCreate && <CreateButton onClick={onCreate} />}
        {onReload && <ReloadButton onClick={onReload} />}
        <MonthButton selected={type === 'month'} onClick={() => setType('month')} />
        <WeekButton selected={type === 'week'} onClick={() => setType('week')} />
      </Box>}
    </Box>}

    {type === 'month' && <Month
      events={events}
      onCreate={onCreate}
      onDelete={onDelete}
      onEdit={onEdit}
      onRestore={onRestore}
      onFirstDate={onFirstDate}
      onLastDate={onLastDate}
      deleteConfirmationMessage={deleteConfirmationMessage}
    />}

    {type === 'week' && <Week
      events={events}
      onCreate={onCreate}
      onDelete={onDelete}
      onEdit={onEdit}
      onRestore={onRestore}
      onFirstDate={onFirstDate}
      onLastDate={onLastDate}
      deleteConfirmationMessage={deleteConfirmationMessage}
    />}
  </Box>
}