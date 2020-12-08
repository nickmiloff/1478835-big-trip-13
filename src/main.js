import TripInfoContainer from './view/trip-info-container';
import TripMenu from './view/trip-menu';
import TripFilters from './view/trip-filters';
import EventsList from './presenter/eventsList';
import {generateEvent} from './mock/event';
import {render, RenderPosition} from './utils/render';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent).sort((a, b) => Date.parse(a.datetime[0]) - Date.parse(b.datetime[0]));

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const tripSortHeaderElement = tripControlElement.querySelector(`h2:first-child`);
const tripEventsContainerElement = siteMainElement.querySelector(`.trip-events`);
const eventsListPresenter = new EventsList(tripEventsContainerElement);

render(tripMainElement, new TripInfoContainer(events), RenderPosition.AFTERBEGIN);
render(tripSortHeaderElement, new TripMenu(), RenderPosition.AFTEREND);
render(tripControlElement, new TripFilters());
eventsListPresenter.init(events);
