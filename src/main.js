import TripInfoContainerView from './view/trip-info-container';
import TripMenuView from './view/trip-menu';
import StatsView from './view/stats';
import EventsListPresenter from './presenter/events-list';
import FiltersPresenter from './presenter/filters';
import EventsModel from './model/events';
import FiltersModel from './model/filter';
import {generateEvent} from './mock/event';
import {render, RenderPosition, remove} from './utils/render';
import {MenuItem} from './utils/const';

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
const tripMenuComponent = new TripMenuView();

let statsComponent = null;

const tripMenuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      statsComponent = new StatsView(eventsModel.getEvents());
      render(tripEventsContainerElement, statsComponent, RenderPosition.AFTEREND);
      eventsListPresenter.destroy();
      siteMainElement.classList.add(`page-main--stats`);
      break;
    case MenuItem.TABLE:
      remove(statsComponent);
      eventsListPresenter.init();
      siteMainElement.classList.remove(`page-main--stats`);
      break;
  }
};

tripMenuComponent.setMenuClickHandler(tripMenuClickHandler);

render(tripMainElement, new TripInfoContainerView(eventsModel.getEvents()), RenderPosition.AFTERBEGIN);
render(tripSortHeaderElement, tripMenuComponent, RenderPosition.AFTEREND);
eventsListPresenter.init();
filterPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  remove(statsComponent);
  eventsListPresenter.destroy();
  tripMenuComponent.setMenuItem(MenuItem.TABLE);
  eventsListPresenter.init();
  eventsListPresenter.createEvent(() => {
    evt.target.disabled = false;
  });
  evt.target.disabled = true;
});
