import { Box, Typography } from '@mui/material';
import { ReloadButton, CreateButton, MonthButton, WeekButton } from './buttons';
import Month from './Month';

export default function Calendar({
  title,
  description,
  events,
  tools,
  onReload,
  onCreate,
  onFirstDate,
  onLastDate,
}) {
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
        <MonthButton />
        <WeekButton />
      </Box>}
    </Box>}

    <Month
      events={events}
      onCreate={onCreate}
      onFirstDate={onFirstDate}
      onLastDate={onLastDate}
    />
  </Box>
}