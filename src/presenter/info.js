import TripInfoContainerView from '../view/trip-info-container';
import {render, replace, remove, RenderPosition} from '../utils/render';

export default class InfoPresenter {
  constructor(container, eventsModel, filterModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

    this._infoComponent = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);

    this._eventsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  init() {
    const events = this._getEvents();
    const prevInfoComponent = this._infoComponent;

    this._infoComponent = new TripInfoContainerView(events);

    if (prevInfoComponent === null) {
      render(this._container, this._infoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._infoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const filtredEvents = this._eventsModel.getFiltredEvents(filterType);

    return filtredEvents;
  }

  _modelEventHandler() {
    this.init();
  }
}
