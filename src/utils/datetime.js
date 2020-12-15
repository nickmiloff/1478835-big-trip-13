import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getTimeDiff = (from, to) => {
  return dayjs(to).diff(dayjs(from));
};

export const toFormatTimeDiff = (ms) => {
  const eventDuration = dayjs.duration(ms).format(`DD[D] HH[H] mm[M]`);

  if (!eventDuration.startsWith(`00D`)) {
    return eventDuration;
  }
  if (!eventDuration.startsWith(`00D 00H`)) {
    return eventDuration.replace(`00D `, ``);
  }
  return eventDuration.replace(`00D 00H `, ``);
};

export const toHoursTimeDiff = (from, to) => dayjs(from).hour() === dayjs(to).hour() ? dayjs(from).minute() - dayjs(to).minute() : dayjs(from).hour() - dayjs(to).hour();
