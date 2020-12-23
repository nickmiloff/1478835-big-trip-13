import EventsModel from './model/events';
import {ApiMethod, SuccessHTTPStatusRange} from './utils/const';

export default class Api {
  constructor(endPoint, authorization, store) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._store = store;
  }

  getEvents() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((events) => events.map(EventsModel.adaptToClient));
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(Api.toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJSON);
  }

  getAllData() {
    return Promise
      .all([
        this.getEvents(),
        this.getDestinations(),
        this.getOffers()
      ])
      .then(([events, destinations, offers]) => {
        this._store.setDestinations(destinations);
        this._store.setOffers(offers);
        return events;
      })
      .catch(() => {
        this._store.setDestinations([]);
        this._store.setOffers([]);
      });
  }

  addEvent(event) {
    return this._load({
      url: `points`,
      method: ApiMethod.POST,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  deleteEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: ApiMethod.DELETE
    });
  }

  updateEvent(event) {
    return this._load({
      url: `points/${event.id}`,
      method: ApiMethod.PUT,
      body: JSON.stringify(EventsModel.adaptToServer(event)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(EventsModel.adaptToClient);
  }

  _load({
    url,
    method = ApiMethod.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
