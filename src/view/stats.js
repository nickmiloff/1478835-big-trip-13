import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Smart from './smart';
import {BAR_HEIGHT, StatsType} from '../utils/const';
import {getTimeDiff, toFormatTimeDiff} from '../utils/datetime';

const getData = (type, events) => {
  const data = {};

  const buffer = {
    labels: new Set(),
    values: {}
  };

  events.forEach((event) => {
    buffer.labels.add(event.type.toUpperCase());

    if (!buffer.values[event.type]) {
      buffer.values[event.type] = 0;
    }
  });

  switch (type) {
    case StatsType.MONEY:
      events.forEach((event) => {
        buffer.values[event.type] += event.price;
      });
      data.formatter = (val) => `€ ${val}`;
      break;
    case StatsType.TYPE:
      events.forEach((event) => {
        buffer.values[event.type] += 1;
      });
      data.formatter = (val) => `${val}x`;
      break;
    case StatsType.SPEND:
      events.forEach((event) => {
        buffer.values[event.type] += getTimeDiff(event.datetime[0], event.datetime[1]);
      });
      data.formatter = (val) => `${toFormatTimeDiff(val)}`;
      break;
  }

  data.labels = Array.from(buffer.labels);
  data.values = Array.from(Object.values(buffer.values));

  return data;
};

const renderChart = (container, type, events) => {
  const data = getData(type, events);

  container.height = BAR_HEIGHT * data.labels.length;

  return new Chart(container, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`,
          minBarLength: 100,
          barThickness: 44,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: data.formatter,
        },
      },
      title: {
        display: true,
        text: type,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

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

  removeElement() {
    super.removeElement();

    this._removeCharts();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _removeCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeSpendChart = null;
    }
  }

  _setCharts() {
    this._removeCharts();

    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const typeCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const spendCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._moneyChart = renderChart(moneyCtx, StatsType.MONEY, this._data);
    this._typeChart = renderChart(typeCtx, StatsType.TYPE, this._data);
    this._timeSpendChart = renderChart(spendCtx, StatsType.SPEND, this._data);
  }
}
