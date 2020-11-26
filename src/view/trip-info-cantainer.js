import Component from './component';

import {createTripInfoTemplate} from './trip-info';
import {createTripCostTemplate} from './trip-cost';

const createTripInfoContainerTemplate = (events) => {
  const cost = events.reduce((fullSum, event) => {
    const offersPrice = event.offers.reduce((sum, offer) => {
      sum += offer.checked ? offer.price : 0;
      return sum;
    }, 0);

    fullSum += (event.price + offersPrice);
    return fullSum;
  }, 0);

  const firstDay = events[0].datetime[0];
  const lastDay = events[events.length - 1].datetime[1];

  const cities = Array.from(new Set(events.map((event) => event.city))).join(` &mdash; `);

  return (
    `<section class="trip-main__trip-info  trip-info">
      ${createTripInfoTemplate(cities, firstDay, lastDay)}
      ${createTripCostTemplate(cost)}
    </section>`
  );
};

export default class TripInfoContainer extends Component {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return this._events && this._events.length > 0 ? createTripInfoContainerTemplate(this._events) : ` `;
  }
}
