import {MENU_ITEMS, CHART_TYPES} from './utils/const';
import {createWaypoint} from './mocks/waypoint';

import RouteInfo from './components/route-info';
import Menu from './components/site-menu';
import Waypoints from './models/waypoints';
import Stats from './components/stats';
import FilterController from './controllers/filter-controller';
import TripController from './controllers/trip-controller';
import {render} from './utils/render';
import {fetchChartData} from './utils/chart-fetch';

const WAYPOINTS_NUMBER = 2;

const waypoints = [];

for (let i = 0; i < WAYPOINTS_NUMBER; i++) {
  waypoints.push(createWaypoint());
}

const tripMainBlock = document.querySelector(`.trip-main`);
const tripBodyBlock = document.querySelector(`.page-main .page-body__container`);
const tripEventsBlock = tripBodyBlock.querySelector(`.trip-events`);
const tripRouteInfoBlock = tripMainBlock.querySelector(`.trip-main__trip-info`);
const tripCost = tripRouteInfoBlock.querySelector(`.trip-info__cost`);
const tripCostValue = tripCost.querySelector(`.trip-info__cost-value`);
const tripControlsBlock = tripMainBlock.querySelector(`.trip-main__trip-controls`);

const _Waypoints = new Waypoints(waypoints);
const _RouteInfo = new RouteInfo(waypoints);
const _Menu = new Menu();
const _Stats = new Stats();
const _FilterController = new FilterController(_Waypoints, tripControlsBlock);
const _TripController = new TripController(_Waypoints, tripEventsBlock);

tripCostValue.textContent = _RouteInfo.cost;

render(tripRouteInfoBlock, _RouteInfo, tripCost);
render(tripControlsBlock, _Menu);
render(tripBodyBlock, _Stats);

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

_FilterController.render();
_TripController.init();
