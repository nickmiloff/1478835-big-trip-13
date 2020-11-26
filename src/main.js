import TripInfoContainer from './view/trip-info-cantainer';
import TripMenu from './view/trip-menu';
import TripFilters from './view/trip-filters';
import TripSort from './view/trip-sort';
import TripEventsList from './view/trip-events-list';
import TripEventForm from './view/trip-event-form';
import TripEvent from './view/trip-event';
import EmptyListMessage from './view/empty-list-message';
import {generateEvent} from './mock/event';
import {isEscButton, render, RenderPosition} from './utils';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent).sort((a, b) => Date.parse(a.datetime[0]) - Date.parse(b.datetime[0]));

const renderEvent = (eventsListElement, event) => {
  const eventComponent = new TripEvent(event);
  const eventFormComponent = new TripEventForm(event);

  const replaceFormToEvent = () => {
    eventsListElement.replaceChild(eventComponent.getElement(), eventFormComponent.getElement());
  };

  const replaceEventToForm = () => {
    eventsListElement.replaceChild(eventFormComponent.getElement(), eventComponent.getElement());
  };

  const eventEscKeydownHandler = (evt) => {
    if (isEscButton(evt.key)) {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener(`keydown`, eventEscKeydownHandler);
    }
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEventToForm();
    document.addEventListener(`keydown`, eventEscKeydownHandler);
  });

  eventFormComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    // Определенный действия при отправке
  });

  eventFormComponent.getElement().querySelector(`form`).addEventListener(`reset`, (evt) => {
    evt.preventDefault();
    // Определенные действия при обнулении
  });

  eventFormComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToEvent();
  });

  render(eventsListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderEventsList = (containerElement, listEvents) => {
  if (listEvents && listEvents.length > 0) {
    render(containerElement, new TripSort().getElement(), RenderPosition.BEFOREEND);
    render(containerElement, new TripEventsList().getElement(), RenderPosition.BEFOREEND);
    const tripEventsListElement = tripEventsContainerElement.querySelector(`.trip-events__list`);

    for (let i = 0; i < EVENTS_COUNT; i++) {
      renderEvent(tripEventsListElement, listEvents[i]);
    }
  } else {
    render(containerElement, new EmptyListMessage().getElement(), RenderPosition.BEFOREEND);
  }
};

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const tripSortHeaderElement = tripControlElement.querySelector(`h2:first-child`);
const tripEventsContainerElement = siteMainElement.querySelector(`.trip-events`);

render(tripMainElement, new TripInfoContainer(events).getElement(), RenderPosition.AFTERBEGIN);
render(tripSortHeaderElement, new TripMenu().getElement(), RenderPosition.AFTEREND);
render(tripControlElement, new TripFilters().getElement(), RenderPosition.BEFOREEND);
renderEventsList(tripEventsContainerElement, events);
