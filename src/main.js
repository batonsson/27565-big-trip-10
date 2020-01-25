import Utils from './utils/utils';
import Waypoints from './models/waypoints';
import Menu from './components/site-menu';
import FilterController from './controllers/filter-controller';
import Stats from './components/stats';
import TripController from './controllers/trip-controller';
import Data from './components/data';
import Api from './api/index';
import {MenuItem, ChartType} from './utils/const';
import {render} from './utils/render';
import {fetchChartData} from './utils/chart-fetch';

const _Data = new Data();

const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;
const AUTH = `Basic eo0w590ik2986969696`;
const API = new Api(END_POINT, AUTH);

const tripMainBlock = document.querySelector(`.trip-main`);
const tripBodyBlock = document.querySelector(`.page-main .page-body__container`);
const tripEventsBlock = tripBodyBlock.querySelector(`.trip-events`);
const tripControlsBlock = tripMainBlock.querySelector(`.trip-main__trip-controls`);

const _Waypoints = new Waypoints();
const _FilterController = new FilterController(_Waypoints, tripControlsBlock);
const _TripController = new TripController(_Waypoints, _Data, API, tripEventsBlock);
const _Menu = new Menu();
const _Stats = new Stats();

window.trip = _TripController;

_Menu.setMenuClickHandler((menuItem) => {
  if (menuItem === _Menu.activeItem) {
    return;
  }

  switch (menuItem) {
    case MenuItem.TABLE:
      _Stats.hide();
      _Stats.destroyAllCharts();
      _TripController.show();
      break;
    case MenuItem.STATS:
      _TripController.hide();
      _Stats.show();
      _Stats.createChart(ChartType.MONEY, _Stats.createChartParams(fetchChartData(_Waypoints, ChartType.MONEY)));
      _Stats.createChart(ChartType.TRANSPORT, _Stats.createChartParams(fetchChartData(_Waypoints, ChartType.TRANSPORT)));
      _Stats.createChart(ChartType.TIME, _Stats.createChartParams(fetchChartData(_Waypoints, ChartType.TIME)));
      break;
  }

  _Menu.setMenuItemActive(menuItem);
});

_Menu.setMenuItemActive(MenuItem.TABLE);
_Stats.hide();
_TripController.show();

render(tripControlsBlock, _Menu);
render(tripBodyBlock, _Stats);

const loadingWaypointsMessage = Utils.createElement(`<p class="trip-events__msg">Loading...</p>`);
render(tripEventsBlock, loadingWaypointsMessage);

const promiseOffers = API.getOffers().then((response) => _Data.setOffers(response));
const promiseDestinations = API.getDestinations().then((response) => _Data.setDestinations(response));

Promise.all([promiseOffers, promiseDestinations]).then(() => {
  API.getWaypoints()
    .then((waypoints) => {
      loadingWaypointsMessage.remove();
      _Waypoints.setWaypoints(waypoints);
      _FilterController.render();
      _TripController.init();
    })
    .catch(() => {
      loadingWaypointsMessage.textContent = `Something is wrong. Do not try later. There is no try.`;
    });
});
