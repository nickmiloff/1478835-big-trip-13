import TripInfoContainer from './view/trip-info-container';
import TripMenu from './view/trip-menu';
import EventsList from './presenter/events-list';
import Filters from './presenter/filters';
import Events from './model/events';
import Filter from './model/filter';
import {generateEvent} from './mock/event';
import {render, RenderPosition} from './utils/render';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const eventsModel = new Events();
eventsModel.setEvents(events);

const filterModel = new Filter();

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const tripSortHeaderElement = tripControlElement.querySelector(`h2:first-child`);
const tripEventsContainerElement = siteMainElement.querySelector(`.trip-events`);
const eventsListPresenter = new EventsList(tripEventsContainerElement, eventsModel, filterModel);
const filterPresenter = new Filters(tripControlElement, filterModel, eventsModel);

render(tripMainElement, new TripInfoContainer(events), RenderPosition.AFTERBEGIN);
render(tripSortHeaderElement, new TripMenu(), RenderPosition.AFTEREND);
eventsListPresenter.init();
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  eventsListPresenter.createTask();
});
