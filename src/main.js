import TripInfoContainerView from './view/trip-info-container';
import TripMenuView from './view/trip-menu';
import EventsListPresenter from './presenter/events-list';
import FiltersPresenter from './presenter/filters';
import EventsModel from './model/events';
import FiltersModel from './model/filter';
import {generateEvent} from './mock/event';
import {render, RenderPosition} from './utils/render';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FiltersModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const tripSortHeaderElement = tripControlElement.querySelector(`h2:first-child`);
const tripEventsContainerElement = siteMainElement.querySelector(`.trip-events`);
const eventsListPresenter = new EventsListPresenter(tripEventsContainerElement, eventsModel, filterModel);
const filterPresenter = new FiltersPresenter(tripControlElement, filterModel, eventsModel);

render(tripMainElement, new TripInfoContainerView(events), RenderPosition.AFTERBEGIN);
render(tripSortHeaderElement, new TripMenuView(), RenderPosition.AFTEREND);
eventsListPresenter.init();
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  eventsListPresenter.createTask();
});
