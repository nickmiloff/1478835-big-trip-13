import TripMenuView from './view/trip-menu';
import StatsView from './view/stats';
import EventsListPresenter from './presenter/events-list';
import FiltersPresenter from './presenter/filters';
import InfoPresenter from './presenter/info';
import EventsModel from './model/events';
import FiltersModel from './model/filter';
import {render, RenderPosition, remove} from './utils/render';
import {MenuItem, UpdateType} from './utils/const';
import Api from './api';
import Store from './store';

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const store = new Store();
const api = new Api(END_POINT, AUTHORIZATION, store);

const eventsModel = new EventsModel();
const filterModel = new FiltersModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const tripSortHeaderElement = tripControlElement.querySelector(`h2:first-child`);
const tripEventsContainerElement = siteMainElement.querySelector(`.trip-events`);
const newEventButtonElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);
const eventsListPresenter = new EventsListPresenter(tripEventsContainerElement, eventsModel, filterModel, api, store);
const filterPresenter = new FiltersPresenter(tripControlElement, filterModel, eventsModel);
const infoPresenter = new InfoPresenter(tripMainElement, eventsModel, filterModel);
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

eventsListPresenter.init();
infoPresenter.init();
filterPresenter.init();

newEventButtonElement.addEventListener(`click`, (evt) => {
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

newEventButtonElement.disabled = true;

api
  .getAllData()
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
    render(tripSortHeaderElement, tripMenuComponent, RenderPosition.AFTEREND);
    newEventButtonElement.disabled = false;
  })
  .catch(()=> {
    eventsModel.setEvents(UpdateType.INIT, []);
    render(tripSortHeaderElement, tripMenuComponent, RenderPosition.AFTEREND);
  });
