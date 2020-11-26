import Component from './component';

const createTripEventsListTemplate = () => {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
};

export default class TripEventsList extends Component {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
