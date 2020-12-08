import TripEventsList from './../view/trip-events-list';
import TripSort from './../view/trip-sort';
import EmptyListMessage from './../view/empty-list-message';
import EventPresenter from './event';
import {render} from './../utils/render';
import {updateItem} from './../utils/common';

export default class EventsList {
  constructor(container) {
    this._container = container;

    this._events = [];
    this._eventPresenter = {};
    this._listComponent = new TripEventsList();
    this._sortComponent = new TripSort();
    this._emptyMessageComponent = new EmptyListMessage();

    this._eventChangeHandler = this._eventChangeHandler.bind(this);
    this._modeChangeHandler = this._modeChangeHandler.bind(this);
  }

  init(events) {
    this._events = [...events];

    this._renderEventsList();
  }

  _renderList() {
    render(this._container, this._listComponent);
  }

  _renderSort() {
    render(this._container, this._sortComponent);
  }

  _renderEmptyMessage() {
    render(this._container, this._emptyMessageComponent);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._listComponent, this._eventChangeHandler, this._modeChangeHandler);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _clearEventsList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _eventChangeHandler(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _modeChangeHandler() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderEventsList() {
    if (this._events && this._events .length > 0) {
      this._renderSort();
      this._renderList();

      this._events .forEach((event) => {
        this._renderEvent(event);
      });
    } else {
      this._renderEmptyMessage();
    }
  }
}
