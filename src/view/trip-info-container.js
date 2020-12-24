import Component from './component';
import {sortByDay, sortByLastDay} from './../utils/sort';
import dayjs from 'dayjs';

const getEventsTotalCost = (events) => {
  return events
    .reduce((total, event) => {
      const offersCost = event.offers
        .reduce((sum, offer) => {
          sum += offer.price;
          return sum;
        }, 0);

      total += (event.price + offersCost);

      return total;
    }, 0);
};

const getEventsCitites = (events) => {
  const cities = Array.from(new Set(events.map((event) => event.city)));
  const citiesLength = cities.length;

  return citiesLength > 3 ? `${cities[0]} &mdash; ... &mdash; ${cities[citiesLength - 1]}` : cities.join(` &mdash; `);
};

const getEventsStartEndDays = (events) => {
  const sortedByStartDayEvents = [...events].sort(sortByDay);
  const sortedByEndDayEvents = [...events].sort(sortByLastDay);

  return [sortedByStartDayEvents[0].datetime[0], sortedByEndDayEvents[sortedByEndDayEvents.length - 1].datetime[1]];
};

const createTripInfoTemplate = (cities = ``, firstDay, lastDay) => {
  const firstDate = dayjs(firstDay);
  const lastDate = dayjs(lastDay);

  const lastDateString = firstDate.get(`month`) !== lastDate.get(`month`) ? lastDate.format(`MMM DD`) : lastDate.format(`DD`);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${cities}</h1>

      <p class="trip-info__dates">${dayjs(firstDay).format(`MMM DD`)}&nbsp;&mdash;&nbsp;${lastDateString}</p>
    </div>`
  );
};

const createTripCostTemplate = (cost) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>`
  );
};

const createTripInfoContainerTemplate = (events) => {
  const cost = getEventsTotalCost(events);
  const startEndDays = getEventsStartEndDays(events);
  const cities = getEventsCitites(events);

  return (
    `<section class="trip-main__trip-info  trip-info">
      ${createTripInfoTemplate(cities, startEndDays[0], startEndDays[1])}
      ${createTripCostTemplate(cost)}
    </section>`
  );
};

export default class TripInfoContainerView extends Component {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return this._events && this._events.length > 0 ? createTripInfoContainerTemplate(this._events) : ` `;
  }
}
