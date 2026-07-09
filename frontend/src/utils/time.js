export function diffHours(date1, date2) {
  if (!date1?.getTime || !date2?.getTime)
    return 0;

  const ms = date2.getTime() - date1.getTime();
  return ms / (1000 * 60 * 60);
}

export function addHours(date, hours) {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
}