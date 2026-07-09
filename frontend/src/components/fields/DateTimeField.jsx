import TextField from './TextField';

function toDateTimeLocal(date) {
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
  ...props
}) {
  return <TextField
    type="datetime-local"
    value={value ? toDateTimeLocal(new Date(value)) : ''}
    onChange={(e) => setData({ ...data, endDate: e.target.value })}
    slotProps={{
      inputLabel: {
          shrink: true,
      },
    }}
    {...props}
  />
}