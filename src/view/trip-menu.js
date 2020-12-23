import Component from './component';

const createTripMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-value="Table">Table</a>
      <a class="trip-tabs__btn" href="#" data-value="Stats">Stats</a>
    </nav>`
  );
};

export default class TripMenuView extends Component {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createTripMenuTemplate();
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-value=${menuItem}]`);
    const prevItem = this.getElement().querySelector(`.trip-tabs__btn--active`);

    if (item !== null && prevItem !== null) {
      item.classList.add(`trip-tabs__btn--active`);
      prevItem.classList.remove(`trip-tabs__btn--active`);
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    if (evt.target.classList.contains(`trip-tabs__btn`) && !evt.target.classList.contains(`trip-tabs__btn--active`)) {
      evt.preventDefault();

      const menuItem = evt.target.textContent;

      this.setMenuItem(menuItem);
      this._callback.menuClick(menuItem);
    }
  }
}
