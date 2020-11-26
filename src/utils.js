import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElementFromArr = (arr) => {
  const randomIndex = getRandomInteger(0, arr.length - 1);

  return arr[randomIndex];
};

export const getRandomElementsFromArr = (arr, minCount = 0, maxCount = 10) => {
  let buffer = [...arr];
  const result = [];

  const generatedCount = getRandomInteger(minCount, maxCount);

  for (let i = 0; i < generatedCount; i++) {
    const randomIndex = getRandomInteger(0, buffer.length - 1);
    result.push(buffer[randomIndex]);
    buffer = [...buffer.slice(0, randomIndex), ...buffer.slice(randomIndex + 1)];
  }

  return result;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.insertAdjacentElement(place, element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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
