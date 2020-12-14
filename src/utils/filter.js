import {FilterType} from './const';

const isFromToday = (event) => Date.parse(event.datetime[0]) - Date.now() >= 0;
const isBeforeToday = (event) => Date.parse(event.datetime[1]) - Date.now() < 0;

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isFromToday(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isBeforeToday(event))
};
