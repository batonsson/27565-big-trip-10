import {menuList} from './mocks/site-menu';
import {filterOptions} from './mocks/filters';
import {sortOptions} from './mocks/sort';
import {createWaypoint} from './mocks/waypoint';

import RouteInfo from './components/route-info';
import Menu from './components/site-menu';
import Filters from './components/filters';
import Sort from './components/sort';
import RouteTrip from './components/route-trip';
import RouteDay from './components/route-day';
import Waypoint from './components/waypoint';
import WaypointEdit from './components/waypoint-edit';
import Utils from './utils';

const WAYPOINTS_NUMBER = 10;

const waypoints = [];

for (let i = 0; i < WAYPOINTS_NUMBER; i++) {
  waypoints.push(createWaypoint());
}

const _RouteInfo = new RouteInfo(waypoints);
const _Menu = new Menu(menuList);
const _Filters = new Filters(filterOptions);
const _Sort = new Sort(sortOptions);
const _RouteTrip = new RouteTrip(waypoints);

const render = (container, element, before) => {
  container.insertBefore(element, before);
};

const tripMainBlock = document.querySelector(`.trip-main`);
const tripEventsBlock = document.querySelector(`.trip-events`);
const tripRouteInfoBlock = tripMainBlock.querySelector(`.trip-main__trip-info`);
const tripCost = tripRouteInfoBlock.querySelector(`.trip-info__cost`);
const tripCostValue = tripCost.querySelector(`.trip-info__cost-value`);
const tripControlsBlock = tripMainBlock.querySelector(`.trip-main__trip-controls`);

tripCostValue.textContent = _RouteInfo.cost;

render(tripRouteInfoBlock, _RouteInfo.getElement(), tripCost);
render(tripControlsBlock, _Menu.getElement());
render(tripControlsBlock, _Filters.getElement());
render(tripEventsBlock, _Sort.getElement());
render(tripEventsBlock, _RouteTrip.getElement());

const tripDayListBlock = tripEventsBlock.querySelector(`.trip-days`);
const dayList = (_RouteTrip.fetchDayList());

dayList.forEach((day) => {
  const _RouteDay = new RouteDay(day);

  render(tripDayListBlock, _RouteDay.getElement());

  const tripWaypointsBlock = tripDayListBlock.querySelector(`.trip-days__item:last-child .trip-events__list`);

  _RouteDay.waypoints.forEach((waypoint) => {
    const _Waypoint = new Waypoint(waypoint);
    const _WaypoinEdit = new WaypointEdit(waypoint);

    const openWaypointEditOpenButton = _Waypoint.getElement().querySelector(`.event__rollup-btn`);
    const openWaypointEditSubmitButton = _WaypoinEdit.getElement().querySelector(`form`);
    const openWaypointEditCancelButton = _WaypoinEdit.getElement().querySelector(`.event__reset-btn`);

    openWaypointEditOpenButton.addEventListener(`click`, () => {
      Utils.replaceElement(_Waypoint.getElement(), _WaypoinEdit.getElement());
    });

    openWaypointEditSubmitButton.addEventListener(`submit`, () => {
      Utils.replaceElement(_WaypoinEdit.getElement(), _Waypoint.getElement());
    });

    openWaypointEditCancelButton.addEventListener(`click`, () => {
      Utils.replaceElement(_WaypoinEdit.getElement(), _Waypoint.getElement());
    });

    tripWaypointsBlock.appendChild(_Waypoint.getElement());
  });
});
