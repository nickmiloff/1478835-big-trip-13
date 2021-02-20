import TripMenuView from './view/trip-menu';
import OfflineMessageView from './view/offline-message';
import EventsListPresenter from './presenter/events-list';
import FiltersPresenter from './presenter/filters';
import InfoPresenter from './presenter/info';
import StatsPresenter from './presenter/stats';
import EventsModel from './model/events';
import FiltersModel from './model/filter';
import {remove, render, RenderPosition} from './utils/render';
import {MenuItem, UpdateType} from './utils/const';
import {isOnline} from './utils/common';
import {message} from './utils/message';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';

const AUTHORIZATION = `Basic kTy9gIdsz2317rD`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const eventsModel = new EventsModel();
const filterModel = new FiltersModel();

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const tripSortHeaderElement = tripControlElement.querySelector(`h2:first-child`);
const tripEventsContainerElement = siteMainElement.querySelector(`.trip-events`);
const newEventButtonElement = tripMainElement.querySelector(`.trip-main__event-add-btn`);
const eventsListPresenter = new EventsListPresenter(tripEventsContainerElement, eventsModel, filterModel, apiWithProvider);
const filterPresenter = new FiltersPresenter(tripControlElement, filterModel, eventsModel);
const infoPresenter = new InfoPresenter(tripMainElement, eventsModel, filterModel);
const statsPresenter = new StatsPresenter(tripEventsContainerElement, eventsModel, filterModel);
const tripMenuComponent = new TripMenuView();
const offlineMessageComponent = new OfflineMessageView();

const tripMenuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      statsPresenter.init();
      eventsListPresenter.destroy();
      siteMainElement.classList.add(`page-main--stats`);
      break;
    case MenuItem.TABLE:
      statsPresenter.destroy();
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
  tripMenuComponent.setMenuItem(MenuItem.TABLE);

  if (!isOnline()) {
    message(`Вы не можете создать ивент в оффлайн режиме`);
    return;
  }

  evt.preventDefault();
  statsPresenter.destroy();
  eventsListPresenter.destroy();
  eventsListPresenter.init();
  eventsListPresenter.createEvent(() => {
    evt.target.disabled = false;
  });
  evt.target.disabled = true;
});

newEventButtonElement.disabled = true;

apiWithProvider
  .getAllData()
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
    render(tripSortHeaderElement, tripMenuComponent, RenderPosition.AFTEREND);
    newEventButtonElement.disabled = false;
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    render(tripSortHeaderElement, tripMenuComponent, RenderPosition.AFTEREND);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  remove(offlineMessageComponent);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
  render(document.body, offlineMessageComponent);
});
