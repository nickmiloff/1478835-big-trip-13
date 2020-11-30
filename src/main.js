import TripInfoContainer from './view/trip-info-cantainer';
import TripMenu from './view/trip-menu';
import TripFilters from './view/trip-filters';
import TripSort from './view/trip-sort';
import TripEventsList from './view/trip-events-list';
import TripEventForm from './view/trip-event-form';
import TripEvent from './view/trip-event';
import EmptyListMessage from './view/empty-list-message';
import {generateEvent} from './mock/event';
import {render, RenderPosition, replace} from './utils/render';
import {isEscButton} from './utils/common';

const EVENTS_COUNT = 20;

const events = new Array(EVENTS_COUNT).fill().map(generateEvent).sort((a, b) => Date.parse(a.datetime[0]) - Date.parse(b.datetime[0]));

const renderEvent = (eventsListElement, event) => {
  const eventComponent = new TripEvent(event);
  const eventFormComponent = new TripEventForm(event);

  const replaceFormToEvent = () => {
    replace(eventComponent, eventFormComponent);
    document.removeEventListener(`keydown`, eventEscKeydownHandler);
  };

  const replaceEventToForm = () => {
    replace(eventFormComponent, eventComponent);
    document.addEventListener(`keydown`, eventEscKeydownHandler);
  };

  const eventEscKeydownHandler = (evt) => {
    if (isEscButton(evt.key)) {
      evt.preventDefault();
      replaceFormToEvent();
    }
  };

  eventComponent.setEditClickHandler(() => {
    replaceEventToForm();
  });

  eventFormComponent.setFormSubmitHandler(() => {
    replaceFormToEvent();
  });

  eventFormComponent.setFormResetHandler(() => {
    replaceFormToEvent();
    // Определенные действия при обнулении
  });

  eventFormComponent.setCloseButtonClickHandler(() => {
    replaceFormToEvent();
  });

  render(eventsListElement, eventComponent);
};

const renderEventsList = (containerElement, listEvents) => {
  if (listEvents && listEvents.length > 0) {
    const tripEventsList = new TripEventsList();

    render(containerElement, new TripSort());
    render(containerElement, tripEventsList);

    listEvents.forEach((event) => {
      renderEvent(tripEventsList, event);
    });
  } else {
    render(containerElement, new EmptyListMessage());
  }
};

const siteHeaderElement = document.querySelector(`.page-header`);
const siteMainElement = document.querySelector(`.page-main`);
const tripMainElement = siteHeaderElement.querySelector(`.trip-main`);
const tripControlElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
const tripSortHeaderElement = tripControlElement.querySelector(`h2:first-child`);
const tripEventsContainerElement = siteMainElement.querySelector(`.trip-events`);

render(tripMainElement, new TripInfoContainer(events), RenderPosition.AFTERBEGIN);
render(tripSortHeaderElement, new TripMenu(), RenderPosition.AFTEREND);
render(tripControlElement, new TripFilters());
renderEventsList(tripEventsContainerElement, events);
