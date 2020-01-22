import AbstractComponent from './abstract-component';
import Chart from 'chart.js';
// import chartjsPluginDatalabels from 'chartjs-plugin-datalabels';

const createStatsMarkup = () => {
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

const chartBarColor = `rgba(255, 255, 255, 1)`;

const defaultParams = {
  type: `horizontalBar`,
  data: {
    labels: [],
    datasets: [{
      label: ``,
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 0
    }]
  },
  options: {
    title: {
      display: true,
      text: ``
    },
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
};

export default class Stats extends AbstractComponent {
  constructor() {
    super();

    this._charts = [];
  }

  _destroyChart(chart) {
    chart.destroy();
  }

  getTemplate() {
    return createStatsMarkup();
  }

  createChartParams(data) {
    const params = JSON.parse(JSON.stringify(defaultParams));
    const length = data.values.length;

    for (let i = 0; i < length; i++) {
      params.data.labels.push(data.labels[i]);
      params.data.datasets[0].data.push(data.values[i]);
      params.data.datasets[0].backgroundColor.push(chartBarColor);
    }

    return params;
  }

  createChart(type, params) {
    const ctx = document.querySelector(`.statistics__chart--${type}`).getContext(`2d`);
    this._charts.push(new Chart(ctx, params));
  }

  destroyAllCharts() {
    this._charts.forEach((chart) => {
      this._destroyChart(chart);
    });

    this._charts = [];
  }
}
