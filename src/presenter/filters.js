import TripFiltersView from '../view/trip-filters';
import {render, replace, remove} from '../utils/render';
import {UpdateType} from '../utils/const';

export default class FiltersPresenter {
  constructor(container, filterModel, eventsModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._eventsModel = eventsModel;

    this._currentFilter = null;

    this._filterComponent = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._filterModel.addObserver(this._modelEventHandler);
    this._eventsModel.addObserver(this._modelEventHandler);
  }

  init() {
    const prevFilterComponent = this._filterComponent;

    this._currentFilter = this._filterModel.getFilter();

    this._filterComponent = new TripFiltersView(this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    if (prevFilterComponent === null) {
      render(this._container, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _modelEventHandler() {
    this.init();
  }

  _filterTypeChangeHandler(filterType) {
    if (this._currentFilter !== filterType) {
      this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    }
  }
}
