import dayjs from 'dayjs';

export const Types = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`,
  `check-in`,
  `sightseeing`,
  `restaurant`
];

export const SortType = {
  DAY: `sort-day`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

export const UserAction = {
  UPDATE_EVENT: `UPDATE_EVENT`,
  ADD_EVENT: `ADD_EVENT`,
  DELETE_EVENT: `DELETE_EVENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const newEventMock = {
  type: `taxi`,
  city: `Amsterdam`,
  offers: [],
  destination: {},
  datetime: [
    dayjs().toDate(),
    dayjs().add(1, `hour`).toDate()
  ],
  price: 0,
  isFavorite: false,
  isAddMode: true
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

export const BAR_HEIGHT = 55;

export const StatsType = {
  MONEY: `MONEY`,
  TYPE: `TYPE`,
  SPEND: `TIME-SPEND`
};

export const ApiMethod = {
  GET: `GET`,
  PUT: `PUT`
};

export const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export const datepickerTemp = {
  enableTime: true,
  dateFormat: `y/m/d H:i`
};
