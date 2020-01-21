import {menuList} from './mocks/site-menu';
import {createWaypoint} from './mocks/waypoint';

import RouteInfo from './components/route-info';
import Menu from './components/site-menu';
import Waypoints from './models/waypoints';
import FilterController from './controllers/FilterController';
import TripController from './components/TripController';
import {render} from './render';

const WAYPOINTS_NUMBER = 2;

const waypoints = [];

for (let i = 0; i < WAYPOINTS_NUMBER; i++) {
  waypoints.push(createWaypoint());
}

const _RouteInfo = new RouteInfo(waypoints);
const _Menu = new Menu(menuList);

const tripMainBlock = document.querySelector(`.trip-main`);
const tripEventsBlock = document.querySelector(`.trip-events`);
const tripRouteInfoBlock = tripMainBlock.querySelector(`.trip-main__trip-info`);
const tripCost = tripRouteInfoBlock.querySelector(`.trip-info__cost`);
const tripCostValue = tripCost.querySelector(`.trip-info__cost-value`);
const tripControlsBlock = tripMainBlock.querySelector(`.trip-main__trip-controls`);

tripCostValue.textContent = _RouteInfo.cost;

render(tripRouteInfoBlock, _RouteInfo, tripCost);
render(tripControlsBlock, _Menu);

const _Waypoints = new Waypoints(waypoints);

const _FilterController = new FilterController(_Waypoints, tripControlsBlock);
_FilterController.render();

const _TripController = new TripController(_Waypoints, tripEventsBlock);

_TripController.init();
