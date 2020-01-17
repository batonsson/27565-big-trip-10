import {menuList} from './mocks/site-menu';
import {filterOptions} from './mocks/filters';
import {createWaypoint} from './mocks/waypoint';

import RouteInfo from './components/route-info';
import Menu from './components/site-menu';
import Filters from './components/filters';
import TripController from './components/TripController';
import Utils from './utils';
import {render} from './render';

const WAYPOINTS_NUMBER = 10;

const waypoints = [];

for (let i = 0; i < WAYPOINTS_NUMBER; i++) {
  waypoints.push(createWaypoint());
}

const _RouteInfo = new RouteInfo(waypoints);
const _Menu = new Menu(menuList);
const _Filters = new Filters(filterOptions);

const tripMainBlock = document.querySelector(`.trip-main`);
const tripEventsBlock = document.querySelector(`.trip-events`);
const tripRouteInfoBlock = tripMainBlock.querySelector(`.trip-main__trip-info`);
const tripCost = tripRouteInfoBlock.querySelector(`.trip-info__cost`);
const tripCostValue = tripCost.querySelector(`.trip-info__cost-value`);
const tripControlsBlock = tripMainBlock.querySelector(`.trip-main__trip-controls`);

tripCostValue.textContent = _RouteInfo.cost;

render(tripRouteInfoBlock, _RouteInfo, tripCost);
render(tripControlsBlock, _Menu);
render(tripControlsBlock, _Filters);

if (waypoints.length) {
  const _TripController = new TripController(waypoints, tripEventsBlock);

  _TripController.init();
} else {
  const noWaypointsMessageTemplate = `<p class="trip-events__msg">Click New Event to create your first point</p>`;

  render(tripEventsBlock, Utils.createElement(noWaypointsMessageTemplate));
}
