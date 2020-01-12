import {menu} from './mocks/site-menu';
import {filters} from './mocks/filters';
import {createWaypoint} from './mocks/waypoint';

import {createRouteInfoMarkup, getRouteCost} from './components/route-info';
import {createMenuMarkup} from './components/site-menu';
import {createFiltersMarkup} from './components/filters';
import {createSortMarkup} from './components/sort';
import {createRouteListMarkup} from './components/route-trip';
import {createWaypointEditMarkup} from './components/waypoint-edit';

const WAYPOINTS_NUMBER = 10;

const waypoints = [];

for (let i = 0; i < WAYPOINTS_NUMBER; i++) {
  waypoints.push(createWaypoint());
}

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainBlock = document.querySelector(`.trip-main`);
const tripEventsBlock = document.querySelector(`.trip-events`);
const tripRouteInfoBlock = tripMainBlock.querySelector(`.trip-main__trip-info`);
const tripCost = tripRouteInfoBlock.querySelector(`.trip-info__cost-value`);
const tripControlsBlock = tripMainBlock.querySelector(`.trip-main__trip-controls`);
const tripControlsMenuHeadline = tripControlsBlock.querySelector(`h2:first-child`);
const tripControlsFiltersHeadline = tripControlsBlock.querySelector(`h2:last-child`);

tripCost.textContent = getRouteCost(waypoints);

render(tripRouteInfoBlock, createRouteInfoMarkup(waypoints), `afterbegin`);
render(tripControlsMenuHeadline, createMenuMarkup(menu), `afterend`);
render(tripControlsFiltersHeadline, createFiltersMarkup(filters), `afterend`);
render(tripEventsBlock, createSortMarkup());
render(tripEventsBlock, createWaypointEditMarkup(waypoints.slice(0)[0], true));
render(tripEventsBlock, createRouteListMarkup(waypoints));
