export function parseTimePeriod(timePeriod) {
  if (typeof timePeriod === 'object')
    return timePeriod;

  const match = /(?:(?<years>\d+)\s*\/\s*)?(?:(?<months>\d+)\s*\/\s*)?(?:(?<days>\d+)\s+)?(?<hours>\d*)?(?:\s*:\s*(?<minutes>\d*))?(?:\s*:\s*(?<seconds>\d*)(?:\s*.\s*(?<milliseconds>\d*))?)?/.exec(timePeriod.trim());
  if (!match?.groups)
    return null;

  const rawYears = match.groups.years;
  const rawMonths = match.groups.months;
  const rawDays = match.groups.days;
  const rawHours = match.groups.hours;
  const rawMinutes = match.groups.minutes;
  const rawSeconds = match.groups.seconds;
  const rawMilliseconds = match.groups.milliseconds;

  const period = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: (parseInt(rawMilliseconds, 10) || 0),
  };

  const dateParts = [rawYears, rawMonths, rawDays].filter(p => p !== undefined && p !== '');
  
  if (dateParts.length === 1) {
    period.days = parseInt(dateParts[0], 10) || 0;
  } else if (dateParts.length === 2) {
    period.months = parseInt(dateParts[0], 10) || 0;
    period.days = parseInt(dateParts[1], 10) || 0;
  } else if (dateParts.length >= 3) {
    period.years = parseInt(dateParts[0], 10) || 0;
    period.months = parseInt(dateParts[1], 10) || 0;
    period.days = parseInt(dateParts[2], 10) || 0;
  }

  const timeParts = [rawHours, rawMinutes, rawSeconds].filter(p => p !== undefined && p !== '');

  if (timeParts.length === 1) {
    period.seconds = parseInt(timeParts[0], 10) || 0;
  } else if (timeParts.length === 2) {
    period.minutes = parseInt(timeParts[0], 10) || 0;
    period.seconds = parseInt(timeParts[1], 10) || 0;
  } else if (timeParts.length >= 3) {
    period.hours = parseInt(timeParts[0], 10) || 0;
    period.minutes = parseInt(timeParts[1], 10) || 0;
    period.seconds = parseInt(timeParts[2], 10) || 0;
  }

  /*const totalDays = days + (months * 30) + (years * 365);
  const totalHours = (totalDays * 24) + hours;
  const totalMinutes = (totalHours * 60) + minutes;
  const totalSeconds = (totalMinutes * 60) + seconds;

  const timeMs = totalSeconds * 1000 + milliseconds;
  
  return timeMs;*/

  return period;
}

export function timePeriod2Milliseconds(timePeriod) {
  const period = parseTimePeriod(timePeriod);
  if (!period)
    return null;

  const totalDays = period.days + (period.months * 30) + (period.years * 365);
  const totalHours = (totalDays * 24) + period.hours;
  const totalMinutes = (totalHours * 60) + period.minutes;
  const totalSeconds = (totalMinutes * 60) + period.seconds;

  return totalSeconds * 1000 + period.milliseconds;
}

export function timePeriod2string(period) {
  const { years, months, days, hours, minutes, seconds } = period;
  return `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function addTimePeriod(date, timePeriod) {
  date = new Date(date);
  date.setTime(date.getTime() + parseTimePeriod(timePeriod));
  return date;
}