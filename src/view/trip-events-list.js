import Component from './component';

const createTripEventsListTemplate = () => {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
};

export default class TripEventsListView extends Component {
  getTemplate() {
    return createTripEventsListTemplate();
  }
}
