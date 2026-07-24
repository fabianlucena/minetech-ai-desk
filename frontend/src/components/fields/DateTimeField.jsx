import TextField from './TextField';

function toDateTimeLocal(date) {
  if (!date)
    return '';

  if (typeof date === 'string')
    return date;

  const pad = (n) => String(n).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export default function DateTimeField({
  value,
  onChange,
  onChangeDate,
  ...props
}) {
  return <TextField
    type="datetime-local"
    value={toDateTimeLocal(value)}
    onChange={(event) =>  {
      onChange?.(event);
      if (!onChangeDate)
        return;

      const date = new Date(event.target.value);
      onChangeDate({ event, date });
    }}
    slotProps={{
      inputLabel: {
          shrink: true,
      },
    }}
    {...props}
  />
}