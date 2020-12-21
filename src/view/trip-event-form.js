import Smart from './smart';
import dayjs from 'dayjs';
import he from 'he';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import {Types, newEventMock, datepickerTemp} from './../utils/const';

const createEventFormOfferTemplate = ({title, price}, checked) => {
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title.replaceAll(` `, `-`).toLowerCase()}-1" type="checkbox" name="event-offer-${title.replaceAll(` `, `-`).toLowerCase()}"${checked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${title.replaceAll(` `, `-`).toLowerCase()}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createEventFormOffersListTemplate = (offers, typeOffres) => {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${typeOffres.map((offer) => {
      const checked = offers.find((cur) => cur.title === offer.title) ? true : false;
      return createEventFormOfferTemplate(offer, checked);
    }).join(``)}
      </div>
    </section>`
  );
};

const createEventDestinationDescriptionTemplate = (description) => {
  return `<p class="event__destination-description">${description}</p>`;
};

const createEventPicturesTemplate = (picture) => {
  return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
};

const createEventPicturesListTemplate = (pictures) => {
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map(createEventPicturesTemplate).join(``)}
      </div>
    </div>`
  );
};

const createEventFormDestinationTemplate = ({description = ``, pictures = []}, withDescription, withPictures) => {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${withDescription ? createEventDestinationDescriptionTemplate(description) : ``}
      ${withPictures ? createEventPicturesListTemplate(pictures) : ``}
    </section>`
  );
};

const createEventTypeItemTemplate = (type, isChecked) => {
  const lowerCaseType = type.toLowerCase();

  return (
    `<div class="event__type-item">
      <input id="event-type-${lowerCaseType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${lowerCaseType}" ${isChecked ? ` checked` : ``}>
      <label class="event__type-label  event__type-label--${lowerCaseType}" for="event-type-${lowerCaseType}-1">${type}</label>
    </div>`
  );
};

const createEventDestinationOptionTemplate = (city) => `<option value="${city}"></option>`;

const createTripEventFormTemplate = (data = {}) => {
  const {type = `taxi`, city = `Amsterdam`, offers = [], typeOffers = [], destination = {}, citiesDestinations = [], price = 0, datetime, isAddMode = true, withOffers = false, withDescription = false, withPictures = false} = data;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${Types.map((current) => createEventTypeItemTemplate(current, type === current)).join(``)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-1" required>
            <datalist id="destination-list-1">
              ${citiesDestinations.map((current) => createEventDestinationOptionTemplate(current.name)).join(``)}
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(datetime[0]).format(`YY/MM/DD HH:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(datetime[1]).format(`YY/MM/DD HH:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit"}>Save</button>
          <button class="event__reset-btn" type="reset">${isAddMode ? `Cancel` : `Delete`}</button>
          ${isAddMode ? `` : `<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>`}
        </header>
        <section class="event__details">
          ${withOffers ? createEventFormOffersListTemplate(offers, typeOffers) : ``}
          ${withDescription || withPictures ? createEventFormDestinationTemplate(destination, withDescription, withPictures) : ``}
        </section>
      </form>
    </li>`
  );
};

export default class TripEventFormView extends Smart {
  constructor(data, destinations, offers) {
    super();
    this._data = data || Object.assign({}, newEventMock);
    this._destinations = destinations;
    this._offers = offers;
    this._startTimeDatepicker = null;
    this._endTimeDatepicker = null;

    this._isNew = data ? false : true;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._startTimeChangeHandler = this._startTimeChangeHandler.bind(this);
    this._endTimeChangeHandler = this._endTimeChangeHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._eventPriceInputHandler = this._eventPriceInputHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickers();
  }

  getTemplate() {
    return createTripEventFormTemplate(TripEventFormView.parseEventToData(this._data, this._offers, this._destinations));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteButtonClickHandler(callback) {
    this._callback.deleteButtonClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteButtonClickHandler);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeButtonClickHandler);
  }

  removeElement() {
    super.removeElement();

    if (this._startTimeDatepicker) {
      this._startTimeDatepicker.destroy();
      this._startTimeDatepicker = null;
    }

    if (this._endTimeDatepicker) {
      this._endTimeDatepicker.destroy();
      this._endTimeDatepicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();

    this.setFormSubmitHandler(this._callback.formSubmit);
    if (!this._isNew) {
      this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    }
    this.setDeleteButtonClickHandler(this._callback.deleteButtonClick);
  }

  reset(event) {
    this.updateData(
        TripEventFormView.parseEventToData(event)
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationChangeHandler);
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._eventTypeChangeHandler);
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._eventPriceInputHandler);
  }

  _setDatepickers() {
    if (this._startTimeDatepicker) {
      this._startTimeDatepicker.destroy();
      this._startTimeDatepicker = null;
    }

    if (this._endTimeDatepicker) {
      this._endTimeDatepicker.destroy();
      this._endTimeDatepicker = null;
    }

    this._startTimeDatepicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        Object.assign(
            {},
            datepickerTemp,
            {
              maxDate: this._data.datetime[1],
              defaultDate: this._data.datetime[0],
              onChange: this._startTimeChangeHandler
            }
        )
    );

    this._endTimeDatepicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        Object.assign(
            {},
            datepickerTemp,
            {
              minDate: this._data.datetime[0],
              defaultDate: this._data.datetime[1],
              onChange: this._endTimeChangeHandler
            }
        )
    );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    const newOffers = [];
    const currentType = this._data.type;
    const typeOffers = this._offers.find((cur) => cur.type === currentType).offers;

    this.getElement()
      .querySelectorAll(`.event__offer-checkbox`)
      .forEach((offer, i) => {
        if (offer.checked) {
          newOffers.push(typeOffers[i]);
        }
      });

    this._data.offers = newOffers;

    this._callback.formSubmit(TripEventFormView.parseDataToEvent(this._data));
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteButtonClick(TripEventFormView.parseDataToEvent(this._data));
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const city = evt.target.value;

    if (!this._destinations.find((current) => current.name === city)) {
      evt.target.setCustomValidity(`Выберите город из предложенного списка`);
      return;
    }

    this.updateData({
      city
    });
  }

  _startTimeChangeHandler([userDate]) {
    this.updateData({
      datetime: [userDate, this._data.datetime[1]]
    }, true);

    this._endTimeDatepicker.set(`minDate`, userDate);
  }

  _endTimeChangeHandler([userDate]) {
    this.updateData({
      datetime: [this._data.datetime[0], userDate]
    }, true);

    this._startTimeDatepicker.set(`maxDate`, userDate);
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value
    });
  }

  _eventPriceInputHandler(evt) {
    evt.preventDefault();

    const numericValue = +evt.target.value;

    if (isNaN(numericValue)) {
      evt.target.setCustomValidity(`Введенное значение не является числом`);
      return;
    }

    if (!Number.isInteger(numericValue)) {
      evt.target.setCustomValidity(`Введенное число не целое`);
      return;
    }

    this.updateData({
      price: numericValue
    }, true);
  }

  static parseEventToData(event, typesOffers = [], citiesDestinations = []) {
    const destination = citiesDestinations && citiesDestinations.find((current) => current.name === event.city);
    let offers = typesOffers && typesOffers.find((current) => current.type === event.type);
    offers = offers && offers.offers;

    return Object.assign(
        {},
        event,
        {
          typeOffers: offers,
          citiesDestinations,
          destination,
          isAddMode: event.isAddMode || false,
          withOffers: offers && offers.length > 0,
          withDescription: destination && destination.description !== ``,
          withPictures: destination && destination.pictures.length > 0
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.typeOffers;
    delete data.citiesDestinations;
    delete data.isAddMode;
    delete data.withOffers;
    delete data.withDescription;
    delete data.withPictures;

    return data;
  }
}
