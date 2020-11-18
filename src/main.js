import {createTripInfoContainerTemplate} from './view/trip-info-cantainer';
import {createTripInfoTemplate} from './view/trip-info';
import {createTripCostTemplate} from './view/trip-cost';
import {createTripMenuTemplate} from './view/trip-menu';
import {createTripFiltersTemplate} from './view/trip-filters';
import {createTripSortTemplate} from './view/trip-sort';
import {createTripEventsListTemplate} from './view/trip-events-list';
import {createTripEventEditFormTemplate} from './view/trip-event-edit-form';
import {createTripEventAddFormTemplate} from './view/trip-event-add-form';
import {createTripEventTemplate} from './view/trip-event';

const EVENTS_COUNT = 3;

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const tripEventsContainerElement = siteMainElement.querySelector(`.trip-events`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMainElement, createTripInfoContainerTemplate(), `afterbegin`);

const tripInfoContainerElement = tripMainElement.querySelector(`.trip-main__trip-info`);

render(tripInfoContainerElement, createTripInfoTemplate(), `beforeend`);
render(tripInfoContainerElement, createTripCostTemplate(), `beforeend`);

render(tripControlElement, createTripMenuTemplate(), `beforeend`);
render(tripControlElement, createTripFiltersTemplate(), `beforeend`);

render(tripEventsContainerElement, createTripSortTemplate(), `beforeend`);
render(tripEventsContainerElement, createTripEventsListTemplate(), `beforeend`);

const tripEventsListElement = tripEventsContainerElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, createTripEventEditFormTemplate(), `beforeend`);
render(tripEventsListElement, createTripEventAddFormTemplate(), `beforeend`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripEventsListElement, createTripEventTemplate(), `beforeend`);
}
