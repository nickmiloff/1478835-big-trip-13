import TripEventsList from './../view/trip-events-list';
import TripSort from './../view/trip-sort';
import EmptyListMessage from './../view/empty-list-message';
import EventPresenter from './event';
import {render, remove} from './../utils/render';
import {sortByDay, sortByTime, sortByPrice} from './../utils/sort';
import {UpdateType, UserAction, SortType} from './../utils/const';

export default class EventsList {
  constructor(container, model) {
    this._container = container;
    this._model = model;

    this._eventPresenter = {};
    this._listComponent = new TripEventsList();
    this._sortComponent = null;
    this._emptyMessageComponent = new EmptyListMessage();
    this._currentSortType = SortType.DAY;

    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);

    this._model.addObserver(this._modelEventHandler);
  }

  init() {
    this._renderEventsList();
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.DAY:
        this._model.getEvents().sort(sortByDay);
        break;
      case SortType.TIME:
        this._model.getEvents().sort(sortByTime);
        break;
      case SortType.PRICE:
        this._model.getEvents().sort(sortByPrice);
        break;
    }

    return this._model.getEvents();
  }

  _renderList() {
    render(this._container, this._listComponent);
  }

  _sortTypeChangeHandler(type) {
    if (this._currentSortType !== type) {
      this._currentSortType = type;
      this._clearEventsList();
      this._renderEventsList();
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new TripSort(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);

    render(this._container, this._sortComponent);
  }

  _renderEmptyMessage() {
    render(this._container, this._emptyMessageComponent);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._listComponent, this._viewActionHandler, this._modeChangeHandler, this._currentSortType);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _clearEventsList({resetSortType = false} = {}) {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._sortComponent);
    remove(this._emptyMessageComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _viewActionHandler(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._model.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._model.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._model.deleteEvent(updateType, update);
        break;
    }
  }

  _modelEventHandler(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearEventsList();
        this._renderEventsList();
        break;
      case UpdateType.MAJOR:
        this._clearEventsList({resetSortType: true});
        this._renderEventsList();
        break;
    }
  }

  _modeChangeHandler() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderEventsList() {
    const events = this._getEvents();
    const eventsCount = events.length;

    if (eventsCount === 0) {
      this._emptyMessageComponent();
      return;
    }

    this._renderSort();
    this._renderList();

    events.forEach((event) => {
      this._renderEvent(event);
    });
  }
}
