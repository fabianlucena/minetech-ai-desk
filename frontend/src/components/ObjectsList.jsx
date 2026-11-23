import { Paper, Box } from '@mui/material';

export default function ObjectsList({
  items,
  getItemId,
  getItemClassName,
  renderItem,
  itemActions,
}) {
  return <Paper
    elevation={0}
    sx={{
      border: '1px solid',
      borderColor: 'grey.400',
      borderRadius: 1,
      p: 1,
      textAlign: 'center',
      bgcolor: 'background.default',
      transition: 'all 0.2s ease-in-out',
      display: 'flex',
      flexDirection: 'row',
      gap: 1,
      height: '100%',
      flexWrap: 'wrap',
      overflowY: 'auto',
      justifyContent: 'space-evenly',
      alignItems: 'flex-start',
    }}
  >
    {items.map((item) => <Box
      key={getItemId(item)}
      className={getItemClassName({item})}
      display="flex"
      gap={1}
      sx={{
        border: '1px solid',
        borderColor: 'grey.500',
        padding: '1em',
        borderRadius: '.5em',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {renderItem(item)}
      {itemActions && <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          justifyContent: "center"
        }}
      >
        {(typeof itemActions === 'function' ? itemActions({item}) : itemActions).map((action, index) => <Box key={index}>
          {action}
        </Box>)}
      </Box>}
    </Box>)}
  </Paper>;
}