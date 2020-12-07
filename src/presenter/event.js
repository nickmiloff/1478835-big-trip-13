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

    this._eventComponent = null;
    this._formComponent = null;
    this._mode = Mode.DEFAULT;

    this._eventEscKeydownHandler = this._eventEscKeydownHandler.bind(this);
    this._replaceEventToForm = this._replaceEventToForm.bind(this);
    this._replaceFormToEvent = this._replaceFormToEvent.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevFormComponent = this._formComponent;

    this._eventComponent = new TripEvent(event);
    this._formComponent = new TripEventForm(event);

    this._eventComponent.setEditClickHandler(this._replaceEventToForm);
    this._eventComponent.setFavoriteClickHandler(this._favoriteClickHandler);

    this._formComponent.setFormSubmitHandler(this._formSubmitHandler);

    this._formComponent.setFormResetHandler(() => {
      this._replaceFormToEvent();
    });

    this._formComponent.setCloseButtonClickHandler(this._replaceFormToEvent);

    if (prevEventComponent === null || prevFormComponent === null) {
      render(this._container, this._eventComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._formComponent, prevFormComponent);
    }

    remove(prevEventComponent);
    remove(prevFormComponent);
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._formComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  _eventEscKeydownHandler(evt) {
    if (isEscButton(evt.key)) {
      evt.preventDefault();
      this._replaceFormToEvent();
    }
  }

  _replaceEventToForm() {
    replace(this._formComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._eventEscKeydownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._formComponent);
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
}
