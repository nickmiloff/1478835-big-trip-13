import Component from './component';

const createOfflineMessageTemplate = () => {
  return `<div class="offline-message"><p class="offline-message__title">Offline</p></div>`;
};

export default class OfflineMessageView extends Component {
  getTemplate() {
    return createOfflineMessageTemplate();
  }
}
