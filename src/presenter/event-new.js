import TripEventFormView from '../view/trip-event-form';
import {getId} from '../utils/common';
import {remove, render, RenderPosition} from '../utils/render';
import {UserAction, UpdateType} from '../utils/const';
import {isEscButton} from '../utils/common';

export default class EventNewPresenter {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;

    this._destroyCallback = null;
    this._eventComponentEdit = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback, destinations, offers) {
    this._destroyCallback = callback;

    if (this._eventComponentEdit !== null) {
      return;
    }

    this._eventComponentEdit = new TripEventFormView(null, destinations, offers);
    this._eventComponentEdit.setFormSubmitHandler(this._formSubmitHandler);
    this._eventComponentEdit.setDeleteButtonClickHandler(this._deleteButtonClickHandler);

    render(this._container, this._eventComponentEdit, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventComponentEdit === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._eventComponentEdit);
    this._eventComponentEdit = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _formSubmitHandler(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        Object.assign({id: getId()}, event)
    );
    this.destroy();
  }

  _deleteButtonClickHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscButton(evt.key)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
