import {createEventFormOfferTemplate} from './event-form-offer';

export const createEventFormOffersListTemplate = (offers) => {
  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">${offers.map(createEventFormOfferTemplate).join(``)}</div>
    </section>
  `;
};
