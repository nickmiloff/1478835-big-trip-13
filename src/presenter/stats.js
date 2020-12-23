import StatsView from '../view/stats';
import {render, replace, remove, RenderPosition} from '../utils/render';

export default class StatsPresenter {
  constructor(container, eventsModel, filterModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

    this._statsComponent = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
  }

  init() {
    this._eventsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);

    this._renderStats();
  }

  destroy() {
    remove(this._statsComponent);
    this._statsComponent = null;

    this._eventsModel.removeObserver(this._modelEventHandler);
    this._filterModel.removeObserver(this._modelEventHandler);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const filtredEvents = this._eventsModel.getFiltredEvents(filterType);

    return filtredEvents;
  }

  _renderStats() {
    const events = this._getEvents();
    const prevStatsComponent = this._statsComponent;

    this._statsComponent = new StatsView(events);

    if (prevStatsComponent === null) {
      render(this._container, this._statsComponent, RenderPosition.AFTEREND);
      return;
    }

    replace(this._statsComponent, prevStatsComponent);
    remove(prevStatsComponent);
  }

  _modelEventHandler() {
    this.init();
  }
}
