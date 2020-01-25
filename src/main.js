import {MENU_ITEMS, CHART_TYPES} from './utils/const';
import Api from './api/index';
import RouteInfo from './components/route-info';
import Menu from './components/site-menu';
import Waypoints from './models/waypoints';
import Stats from './components/stats';
import FilterController from './controllers/filter-controller';
import TripController from './controllers/trip-controller';
import {render} from './utils/render';
import {fetchChartData} from './utils/chart-fetch';
import Data from './components/data';

const _Data = new Data();

const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;
const AUTH = `Basic eo0w590ik2986969`;
const API = new Api(END_POINT, AUTH);

const tripMainBlock = document.querySelector(`.trip-main`);
const tripBodyBlock = document.querySelector(`.page-main .page-body__container`);
const tripEventsBlock = tripBodyBlock.querySelector(`.trip-events`);
const tripRouteInfoBlock = tripMainBlock.querySelector(`.trip-main__trip-info`);
const tripCost = tripRouteInfoBlock.querySelector(`.trip-info__cost`);
const tripCostValue = tripCost.querySelector(`.trip-info__cost-value`);
const tripControlsBlock = tripMainBlock.querySelector(`.trip-main__trip-controls`);

const _Waypoints = new Waypoints();
const _FilterController = new FilterController(_Waypoints, tripControlsBlock);
const _TripController = new TripController(_Waypoints, _Data, API, tripEventsBlock);
const _Menu = new Menu();
const _Stats = new Stats();

_Menu.setMenuClickHandler((menuItem) => {
  if (menuItem === _Menu.activeItem) {
    return;
  }

  switch (menuItem) {
    case MENU_ITEMS.TABLE:
      _Stats.hide();
      _Stats.destroyAllCharts();
      _TripController.show();
      break;
    case MENU_ITEMS.STATS:
      _TripController.hide();
      _Stats.show();
      _Stats.createChart(CHART_TYPES.MONEY, _Stats.createChartParams(fetchChartData(_Waypoints, CHART_TYPES.MONEY)));
      _Stats.createChart(CHART_TYPES.TRANSPORT, _Stats.createChartParams(fetchChartData(_Waypoints, CHART_TYPES.TRANSPORT)));
      _Stats.createChart(CHART_TYPES.TIME, _Stats.createChartParams(fetchChartData(_Waypoints, CHART_TYPES.TIME)));
      break;
  }

  _Menu.setMenuItemActive(menuItem);
});

_Menu.setMenuItemActive(MENU_ITEMS.TABLE);
_Stats.hide();
_TripController.show();

render(tripControlsBlock, _Menu);
render(tripBodyBlock, _Stats);

const promiseOffers = API.getOffers().then((response) => _Data.setOffers(response));
const promiseDestinations = API.getDestinations().then((response) => _Data.setDestinations(response));

Promise.all([promiseOffers, promiseDestinations]).then(() => {
  API.getWaypoints().then((waypoints) => {
    _Waypoints.setWaypoints(waypoints);
    const _RouteInfo = new RouteInfo(_Waypoints.getWaypoints());

    render(tripRouteInfoBlock, _RouteInfo, tripCost);
    tripCostValue.textContent = _RouteInfo.cost;
    _FilterController.render();
    _TripController.init();
  });
});
