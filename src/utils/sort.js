import {toHoursTimeDiff} from './datetime';

export const sortByDay = (a, b) => Date.parse(a.datetime[0]) - Date.parse(b.datetime[0]);
export const sortByTime = (a, b) => toHoursTimeDiff(a.datetime[0], b.datetime[0]);
export const sortByPrice = (a, b) => a.price - b.price;

export const isDifferentDay = (a, b) => Date.parse(a.datetime[0]) !== Date.parse(b.datetime[0]);
export const isDifferentTime = (a, b) => toHoursTimeDiff(a.datetime[0], b.datetime[0]) !== 0;
