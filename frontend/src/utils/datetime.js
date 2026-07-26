export function diffHours(date1, date2) {
  if (!date1?.getTime || !date2?.getTime)
    return 0;

  const ms = date2.getTime() - date1.getTime();
  return ms / (1000 * 60 * 60);
}

export function diffHoursMinutes(date1, date2) {
  const hours = diffHours(date1, date2) || 0;
  const minutes = Math.floor((hours - Math.floor(hours)) * 60);
  return `${Math.floor(hours).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function addHours(date, hours) {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
}

export function formatDate(date) {
  if (!date)
    return date;

  return new Date(date).toLocaleString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replaceAll(',', '');
}

export function formatTime(date) {
  if (!date?.getTime || Number.isNaN(date.getTime())) {
    return '';
  }

  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function formatRelativeDate(date) {
  if (!date?.getTime) {
    return '';
  }
  
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday)
    return 'Hoy';
  
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isYesterday)
    return 'Ayer';

  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

export function formatRelativeDateTime(date) {
  if (!date?.getTime) {
    return '';
  }

  return `${formatRelativeDate(date)} a las ${formatTime(date)}`;
}