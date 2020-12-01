import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const toFormatTimeDiff = (from, to) => {
  const ms = dayjs(to).diff(dayjs(from));
  const eventDuration = dayjs.duration(ms);

  const Durations = {
    days: Math.floor(eventDuration.asDays()),
    hours: eventDuration.hours(),
    minutes: eventDuration.minutes()
  };

  const days = Durations.days < 10 ? `0${Durations.days}D` : `${Durations.days}D`;
  const hours = Durations.hours < 10 ? `0${Durations.hours}H` : `${Durations.hours}H`;
  const minutes = Durations.minutes < 10 ? `0${Durations.minutes}M` : `${Durations.minutes}M`;

  if (days !== `00D`) {
    return `${days} ${hours} ${minutes}`;
  }
  if (hours !== `00H`) {
    return `${hours} ${minutes}`;
  }
  return `${minutes}`;
};
