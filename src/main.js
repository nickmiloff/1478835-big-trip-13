import {createTripInfoContainerTemplate} from './view/trip-info-cantainer';
import {createTripMenuTemplate} from './view/trip-menu';
import {createTripFiltersTemplate} from './view/trip-filters';
import {createTripSortTemplate} from './view/trip-sort';
import {createTripEventsListTemplate} from './view/trip-events-list';
import {createTripEventFormTemplate} from './view/trip-event-form';
import {createTripEventTemplate} from './view/trip-event';
import {generateEvent} from './mock/event';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent).sort((a, b) => Date.parse(a.datetime[0]) - Date.parse(b.datetime[0]));

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const tripEventsContainerElement = siteMainElement.querySelector(`.trip-events`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMainElement, createTripInfoContainerTemplate(events), `afterbegin`);

render(tripControlElement, createTripMenuTemplate(), `beforeend`);
render(tripControlElement, createTripFiltersTemplate(), `beforeend`);

render(tripEventsContainerElement, createTripSortTemplate(), `beforeend`);
render(tripEventsContainerElement, createTripEventsListTemplate(), `beforeend`);

const tripEventsListElement = tripEventsContainerElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, createTripEventFormTemplate(events[0]), `beforeend`);

for (let i = 1; i < EVENTS_COUNT; i++) {
  render(tripEventsListElement, createTripEventTemplate(events[i]), `beforeend`);
}
