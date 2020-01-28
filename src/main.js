import Utils from './utils/utils';
import Waypoints from './models/waypoints';
import Menu from './components/site-menu';
import FilterController from './controllers/filter-controller';
import Stats from './components/stats';
import TripController from './controllers/trip-controller';
import RouteData from './models/route-data';
import Api from './api/index';
import Provider from './api/provider';
import Store from './api/store';
import {MenuItem, ChartType} from './utils/const';
import {render} from './utils/render';
import {fetchChartData} from './utils/chart-fetch';

const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const routeData = new RouteData();

const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;
const AUTH = `Basic eo0w590i12dkfipcv9`;
const api = new Api(END_POINT, AUTH);
const store = new Store(STORE_NAME, window.localStorage);
const provider = new Provider(api, store);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
    .then(() => {})
    .catch(() => {});
});

window.addEventListener(`offline`, () => {
  document.title += ` offline`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.substring(0, document.title.indexOf(` offline`));

  if (!provider.isSynchronized) {
    provider.sync();
  }
});

const tripMainBlock = document.querySelector(`.trip-main`);
const tripBodyBlock = document.querySelector(`.page-main .page-body__container`);
const tripEventsBlock = tripBodyBlock.querySelector(`.trip-events`);
const tripControlsBlock = tripMainBlock.querySelector(`.trip-main__trip-controls`);

const waypointsModel = new Waypoints();
const filterController = new FilterController(waypointsModel, tripControlsBlock);
const tripController = new TripController(waypointsModel, routeData, provider, tripEventsBlock);
const menu = new Menu();
const stats = new Stats();

menu.setMenuClickHandler((menuItem) => {
  if (menuItem === menu.activeItem) {
    return;
  }

  switch (menuItem) {
    case MenuItem.TABLE:
      stats.hide();
      stats.destroyAllCharts();
      tripController.show();
      break;
    case MenuItem.STATS:
      tripController.hide();
      stats.show();
      stats.createChart(ChartType.MONEY, stats.createChartParams(fetchChartData(waypointsModel, ChartType.MONEY)));
      stats.createChart(ChartType.TRANSPORT, stats.createChartParams(fetchChartData(waypointsModel, ChartType.TRANSPORT)));
      stats.createChart(ChartType.TIME, stats.createChartParams(fetchChartData(waypointsModel, ChartType.TIME)));
      break;
  }

  menu.setMenuItemActive(menuItem);
});

menu.setMenuItemActive(MenuItem.TABLE);
stats.hide();
tripController.show();

render(tripControlsBlock, menu);
render(tripBodyBlock, stats);

const loadingWaypointsMessage = Utils.createElement(`<p class="trip-events__msg">Loading...</p>`);
render(tripEventsBlock, loadingWaypointsMessage);

const promiseOffers = provider.getOffers().then((response) => routeData.setOffers(response));
const promiseDestinations = provider.getDestinations().then((response) => routeData.setDestinations(response));

Promise.all([promiseOffers, promiseDestinations]).then(() => {
  provider.getWaypoints()
    .then((waypoints) => {
      loadingWaypointsMessage.remove();
      waypointsModel.setWaypoints(waypoints);
      filterController.render();
      tripController.init();
    })
    .catch(() => {
      loadingWaypointsMessage.textContent = `Something is wrong. Do not try later. There is no try.`;
    });
});
