import {KEYCODES} from './const';

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

if (waypoints.length) {
  let closeWaypointEditEscHandler = null;

  const openWaypointEdit = (waypoint, waypointEdit) => {
    // close open waypoint edit form
    if (tripEventsBlock.querySelector(`.event--edit`)) {
      document.dispatchEvent(
          new KeyboardEvent(
              `keydown`,
              {
                keyCode: 27
              }
          )
      );
    }

    Utils.replaceElement(waypoint, waypointEdit);

    closeWaypointEditEscHandler = (evt) => {
      if (evt.keyCode === KEYCODES.ESC || evt.which === KEYCODES.ESC) {
        closeWaypointEdit(waypoint, waypointEdit);
      }
    };

    document.addEventListener(`keydown`, closeWaypointEditEscHandler);
  };

  const closeWaypointEdit = (waypoint, waypointEdit) => {
    Utils.replaceElement(waypointEdit, waypoint);

    document.removeEventListener(`keydown`, closeWaypointEditEscHandler);
  };

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
      const _WaypointEdit = new WaypointEdit(waypoint);

      const openWaypointEditOpenButton = _Waypoint.getElement().querySelector(`.event__rollup-btn`);
      const closeWaypointEditSubmitButton = _WaypointEdit.getElement().querySelector(`form`);
      const closeWaypointEditCancelButton = _WaypointEdit.getElement().querySelector(`.event__reset-btn`);

      openWaypointEditOpenButton.addEventListener(`click`, () => {
        openWaypointEdit(_Waypoint.getElement(), _WaypointEdit.getElement());
      });

      closeWaypointEditSubmitButton.addEventListener(`submit`, () => {
        closeWaypointEdit(_Waypoint.getElement(), _WaypointEdit.getElement());
      });

      closeWaypointEditCancelButton.addEventListener(`click`, () => {
        closeWaypointEdit(_Waypoint.getElement(), _WaypointEdit.getElement());
      });

      tripWaypointsBlock.appendChild(_Waypoint.getElement());
    });
  });
} else {
  const noWaypointsMessageTemplate = `<p class="trip-events__msg">Click New Event to create your first point</p>`;

  render(tripEventsBlock, Utils.createElement(noWaypointsMessageTemplate));
}
