import Component from './component';

const createEmptyListMessageTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class EmptyListMessage extends Component {
  getTemplate() {
    return createEmptyListMessageTemplate();
  }
}
