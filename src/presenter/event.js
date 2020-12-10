import TripEvent from "./../view/trip-event";
import TripEventForm from "./../view/trip-event-form";

import {render, replace, remove} from "./../utils/render";
import {isEscButton} from "./../utils/common";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
};

export default class EventPresenter {
  constructor(container, changeData, changeMode) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

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
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventComponentEdit = this._eventComponentEdit;

    this._eventComponent = new TripEvent(this._event);
    this._eventComponentEdit = new TripEventForm(this._event);

    this._eventComponent.setEditClickHandler(this._replaceEventToForm);
    this._eventComponent.setFavoriteClickHandler(this._favoriteClickHandler);

    this._eventComponentEdit.setFormSubmitHandler(this._formSubmitHandler);

    this._eventComponentEdit.setFormResetHandler(this._formResetHandler);

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

  _eventEscKeydownHandler(evt) {
    if (isEscButton(evt.key)) {
      evt.preventDefault();
      this._eventComponentEdit.reset(this._event);
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

  _favoriteClickHandler() {
    this._changeData(
        Object.assign({}, this._event, {
          isFavorite: !this._event.isFavorite,
        })
    );
  }

  _formSubmitHandler(event) {
    this._changeData(event);
    this._replaceFormToEvent();
  }

  _formResetHandler() {
    this._eventComponentEdit.reset(this._event);
    this._replaceFormToEvent();
  }
}
