import EventsModel from '../model/events';
import {isOnline} from "../utils/common.js";

const AdditionalDataKeys = {
  OFFERS: `OFFERS`,
  DESTINATIONS: `DESTINATIONS`
};

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map(EventsModel.adaptToServer));
          this._store.setItems(items);
          return events;
        });
    }

    const storeEvents = Object.values(this._store.getItems());

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  getDestinations(init = false) {
    if (isOnline() && init) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setAdditionalDataByKey(AdditionalDataKeys.DESTINATIONS, destinations);
          return destinations;
        });
    }

    return init ? Promise.resolve(
      this._store.getAdditionalDataByKey(AdditionalDataKeys.DESTINATIONS)
    ) :
    this._store.getAdditionalDataByKey(AdditionalDataKeys.DESTINATIONS);
  }

  getOffers(init = false) {
    if (isOnline() && init) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setAdditionalDataByKey(AdditionalDataKeys.OFFERS, offers);
          return offers;
        });
    }

    return init ? Promise.resolve(
      this._store.getAdditionalDataByKey(AdditionalDataKeys.OFFERS)
    ) :
    this._store.getAdditionalDataByKey(AdditionalDataKeys.OFFERS);
  }

  getAllData() {
    return Promise
      .all([
        this.getEvents(),
        this.getDestinations(true),
        this.getOffers(true)
      ])
      .then(([events]) => {
        return events;
      })
      .catch(() => {
        this._store.setAdditionalDataByKey(AdditionalDataKeys.DESTINATIONS, []);
        this._store.setAdditionalDataByKey(AdditionalDataKeys.OFFERS, []);
      });
  }

  addEvent(event) {
    if (isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._store.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    return Promise.reject(new Error(`Ошибка при попытке добавления нового ивента`));
  }

  deleteEvent(event) {
    if (isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._store.removeItem(event.id));
    }

    return Promise.reject(new Error(`Ошибка при попытке удаления ивента`));
  }

  updateEvent(event) {
    if (isOnline()) {
      return this._api.updateEvent(event)
        .then((updated) => {
          this._store.setItem(updated.id, EventsModel.adaptToServer(updated));
          return updated;
        });
    }

    this._store.setItem(event.id, EventsModel.adaptToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._store.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updateds = getSyncedEvents(response.updated);
          const items = createStoreStructure([...createdEvents, ...updateds]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Ошибка при попытке синхронизации данных`));
  }
}
