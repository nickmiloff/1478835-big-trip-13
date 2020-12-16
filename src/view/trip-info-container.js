import Component from './component';
import {sortByDay} from './../utils/sort';
import dayjs from 'dayjs';

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
  const cost = events.reduce((fullSum, event) => {
    const offersPrice = event.offers.reduce((sum, offer) => {
      sum += offer.checked ? offer.price : 0;
      return sum;
    }, 0);

    fullSum += (event.price + offersPrice);
    return fullSum;
  }, 0);

  const sortedEvents = [...events].sort(sortByDay);

  const firstDay = sortedEvents[0].datetime[0];
  const lastDay = sortedEvents[sortedEvents.length - 1].datetime[1];

  const cities = Array.from(new Set(events.map((event) => event.city))).join(` &mdash; `);

  return (
    `<section class="trip-main__trip-info  trip-info">
      ${createTripInfoTemplate(cities, firstDay, lastDay)}
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
