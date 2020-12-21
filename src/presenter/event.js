import TripEventView from './../view/trip-event';
import TripEventFormView from './../view/trip-event-form';

import {render, replace, remove} from './../utils/render';
import {isEscButton} from './../utils/common';
import {UserAction, UpdateType, SortType} from './../utils/const';
import {isDifferentDay, isDifferentTime} from './../utils/sort';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

export default class EventPresenter {
  constructor(container, changeData, changeMode, currentSortType) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._currentSortType = currentSortType;

    this._event = null;
    this._eventComponent = null;
    this._eventComponentEdit = null;
    this._mode = Mode.DEFAULT;

    this._eventEscKeydownHandler = this._eventEscKeydownHandler.bind(this);
    this._replaceEventToForm = this._replaceEventToForm.bind(this);
    this._replaceFormToEvent = this._replaceFormToEvent.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formResetHandler = this._formResetHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
  }

  init(event, destinations, offers) {
    const prevEventComponent = this._eventComponent;
    const prevEventComponentEdit = this._eventComponentEdit;

    this._event = event;

    this._eventComponent = new TripEventView(this._event);
    this._eventComponentEdit = new TripEventFormView(this._event, destinations, offers);

    this._eventComponent.setEditClickHandler(this._replaceEventToForm);
    this._eventComponent.setFavoriteClickHandler(this._favoriteClickHandler);

    this._eventComponentEdit.setFormSubmitHandler(this._formSubmitHandler);
    this._eventComponentEdit.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._eventComponentEdit.setCloseButtonClickHandler(this._formResetHandler);

    if (prevEventComponent === null || prevEventComponentEdit === null) {
      render(this._container, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventComponentEdit, prevEventComponentEdit);
    }

    remove(prevEventComponent);
    remove(prevEventComponentEdit);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventComponentEdit);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._eventComponentEdit, this._eventComponent);
    document.addEventListener(`keydown`, this._eventEscKeydownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._eventComponentEdit);
    document.removeEventListener(`keydown`, this._eventEscKeydownHandler);
    this._mode = Mode.DEFAULT;
  }

  _eventEscKeydownHandler(evt) {
    if (isEscButton(evt.key)) {
      evt.preventDefault();
      this._eventComponentEdit.reset(this._event);
      this._replaceFormToEvent();
    }
  }

  _favoriteClickHandler() {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        Object.assign({}, this._event, {
          isFavorite: !this._event.isFavorite,
        })
    );
  }

  _formSubmitHandler(event) {
    const isMinorUpdate =
      (this._currentSortType === SortType.DAY && isDifferentDay(this._event, event)) ||
      (this._currentSortType === SortType.PRICE && this._event.price !== event.price) ||
      (this._currentSortType === SortType.TIME && isDifferentTime(this._event, event));

    this._changeData(
        UserAction.UPDATE_EVENT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        event
    );
    this._replaceFormToEvent();
  }

  _formResetHandler() {
    this._eventComponentEdit.reset(this._event);
    this._replaceFormToEvent();
  }

  _deleteButtonClickHandler(event) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        event
    );
  }
}
