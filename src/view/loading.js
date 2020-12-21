import Component from './component';

const createLoadingTemplate = () => {
  return (
    `<p class="trip-events__msg">Loading...</p>`
  );
};

export default class LoadingView extends Component {
  getTemplate() {
    return createLoadingTemplate();
  }
}
