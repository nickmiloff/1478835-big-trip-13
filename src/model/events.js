import Observer from '../utils/observer.js';
import {filter} from '../utils/filter';

export default class EventsModel extends Observer {
  constructor() {
    super();
    this._events = [];
    this._offers = [];
    this._destinations = [];
  }

  setEvents(updateType, events) {
    this._events = [...events];

    this._notify(updateType);
  }

  setOffers(offers) {
    this._offers = [...offers];
  }

  setDestinations(destinations) {
    this._destinations = [...destinations];
  }

  getEvents() {
    return this._events;
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }

  getFiltredEvents(filterType) {
    return filter[filterType](this._events);
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Невозможно обновить несуществующий ивент`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Невозможно удалить несуществующий ивент`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          price: event.base_price,
          datetime: [
            event.date_from,
            event.date_to
          ],
          isFavorite: event.is_favorite,
          city: event.destination.name
        }
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;
    delete adaptedEvent.destination.name;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          "base_price": event.price,
          "date_from": event.datetime[0],
          "date_to": event.datetime[1],
          "is_favorite": event.isFavorite,
          "destination": Object.assign(
              {},
              event.destination,
              {
                name: event.city
              }
          )
        }
    );

    delete adaptedEvent.price;
    delete adaptedEvent.datetime;
    delete adaptedEvent.isFavorite;
    delete adaptedEvent.city;

    return adaptedEvent;
  }
}
