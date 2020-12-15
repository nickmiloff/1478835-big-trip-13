import {toHoursTimeDiff} from './datetime';
import {SortType} from '../utils/const';

export const sortByDay = (a, b) => Date.parse(a.datetime[0]) - Date.parse(b.datetime[0]);
const sortByTime = (a, b) => toHoursTimeDiff(a.datetime[0], b.datetime[0]);
const sortByPrice = (a, b) => a.price - b.price;

export const sortEvents = (type, events) => {
  switch (type) {
    case SortType.DAY:
      events.sort(sortByDay);
      break;
    case SortType.TIME:
      events.sort(sortByTime);
      break;
    case SortType.PRICE:
      events.sort(sortByPrice);
      break;
  }

  return events;
};

export const isDifferentDay = (a, b) => Date.parse(a.datetime[0]) !== Date.parse(b.datetime[0]);
export const isDifferentTime = (a, b) => toHoursTimeDiff(a.datetime[0], b.datetime[0]) !== 0;
