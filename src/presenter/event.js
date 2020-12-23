import TripEventView from './../view/trip-event';
import TripEventFormView from './../view/trip-event-form';

import {render, replace, remove} from './../utils/render';
import {isEscButton, isOnline} from './../utils/common';
import {UserAction, UpdateType, SortType} from './../utils/const';
import {isDifferentDay, isDifferentTime} from './../utils/sort';
import {message} from './../utils/message';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
  ABORTING: `ABORTING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`
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
    this._editButtonClickHandler = this._editButtonClickHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
  }

  init(event, destinations, offers) {
    const prevEventComponent = this._eventComponent;
    const prevEventComponentEdit = this._eventComponentEdit;

    this._event = event;

    this._eventComponent = new TripEventView(this._event);
    this._eventComponentEdit = new TripEventFormView(this._event, destinations, offers);

    this._eventComponent.setEditClickHandler(this._editButtonClickHandler);
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
      replace(this._eventComponent, prevEventComponentEdit);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventComponentEdit);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventComponentEdit.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventComponentEdit.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._eventComponentEdit.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._eventComponent.shake(resetFormState);
        this._eventComponentEdit.shake(resetFormState);
        break;
    }
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
    if (!isOnline()) {
      message(`Вы не можете сохранить ивент в оффлайн режиме`);
      return;
    }

    const isMinorUpdate =
      (this._currentSortType === SortType.DAY && isDifferentDay(this._event, event)) ||
      (this._currentSortType === SortType.PRICE && this._event.price !== event.price) ||
      (this._currentSortType === SortType.TIME && isDifferentTime(this._event, event));

    this._changeData(
        UserAction.UPDATE_EVENT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        event
    );
  }

  _formResetHandler() {
    this._eventComponentEdit.reset(this._event);
    this._replaceFormToEvent();
  }

  _editButtonClickHandler() {
    if (!isOnline()) {
      message(`Вы не можете изменить ивент в оффлайн режиме`);
      return;
    }

    this._replaceEventToForm();
  }

  _deleteButtonClickHandler(event) {
    if (!isOnline()) {
      message(`Вы не можете удалить ивент в оффлайн режиме`);
      return;
    }

    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        event
    );
  }
}
