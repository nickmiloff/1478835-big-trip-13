import Smart from './smart';
import {renderChart} from '../utils/stats';
import {StatsType} from '../utils/const';


const createStatsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class StatsView extends Smart {
  constructor(events) {
    super();

    this._data = events;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  removeElement() {
    super.removeElement();

    this._removeCharts();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const spendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._removeCharts();

    this._moneyChart = renderChart(moneyCtx, StatsType.MONEY, this._data);
    this._typeChart = renderChart(typeCtx, StatsType.TYPE, this._data);
    this._timeSpendChart = renderChart(spendCtx, StatsType.SPEND, this._data);
  }

  _removeCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeSpendChart = null;
    }
  }
}
