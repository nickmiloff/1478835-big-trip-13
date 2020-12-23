import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
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

export const renderChart = (container, type, events) => {
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
