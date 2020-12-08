import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const toFormatTimeDiff = (from, to) => {
  const ms = dayjs(to).diff(dayjs(from));
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
