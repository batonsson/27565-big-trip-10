import {sortOptions} from '../mocks/sort';

import RouteTrip from './route-trip';
import RouteDay from './route-day';
import Sort from './sort';
import PointController, {Mode as PointControllerMode} from './PointController';
import Utils from '../utils';

import {render} from '../render';

const sortByTime = (next, prev) => {
  return prev.time.diff.raw - next.time.diff.raw;
};

const sortByPrice = (next, prev) => {
  return prev.price - next.price;
};

const sortWaypoints = (waypoints, sortType) => {
  if (sortType === `price`) {
    waypoints.sort(sortByPrice);
  }

  if (sortType === `time`) {
    waypoints.sort(sortByTime);
  }

  return waypoints;
};

export default class TripController {
  constructor(Waypoints, container) {
    this._Waypoints = Waypoints;
    this._container = container;
    this._Sort = null;
    this._RouteTrip = null;
    this._PointControllers = [];

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  _dataChangeHandler(_PointController, oldData, newData) {
    if (newData === null) {
      this._Waypoints.deleteWaypoint(oldData.id);
      this.renderWaypoints(`event`);
    }

    if (oldData === null) {
      this._Waypoints.addWaypoint(newData);
      this.renderWaypoints(`event`);
    }

    if (newData && oldData) {
      this._Waypoints.updateWaypoint(oldData.id, newData);
      _PointController._WaypointEdit.rerender();
    }
  }

  _sortClickHandler(sortType) {
    this.renderWaypoints(sortType);
  }

  _viewChangeHandler() {
    this._PointControllers.forEach((pointController) => {
      pointController.setDefaultView();
    });
  }

  _filterChangeHandler() {
    this.renderWaypoints(this._Sort.activeSortType);
  }

  _toggleNoWaypointsMessage(show) {
    const noWaypointsMessageElement = document.querySelector(`.trip-events__msg`);

    if (noWaypointsMessageElement !== null) {
      noWaypointsMessageElement.remove();
    }

    if (show) {
      const noWaypointsMessageTemplate = `<p class="trip-events__msg">Click New Event to create your first point</p>`;
      render(this._container, Utils.createElement(noWaypointsMessageTemplate));
    }
  }

  set RouteTrip(_RouteTrip) {
    this._RouteTrip = _RouteTrip;
  }

  renderWaypoints(sortType) {
    const waypoints = this._Waypoints.getWaypoints();
    const tripDayListBlock = this._container.querySelector(`.trip-days`);
    tripDayListBlock.innerHTML = ``;

    if (!waypoints.length) {
      this._toggleNoWaypointsMessage(true);
      return;
    } else {
      this._toggleNoWaypointsMessage(false);
    }

    let dayList;

    switch (sortType) {
      case `event`:
        dayList = this._RouteTrip.fetchDayList(waypoints);
        break;
      default:
        dayList = [
          {
            date: null,
            waypoints: sortWaypoints(waypoints, sortType),
            index: null
          }
        ];
    }

    dayList.forEach((day) => {
      const _RouteDay = new RouteDay(day);

      render(tripDayListBlock, _RouteDay);

      const tripWaypointsBlock = tripDayListBlock.querySelector(`.trip-days__item:last-child .trip-events__list`);

      _RouteDay.waypoints.forEach((waypoint) => {
        const _PointController = new PointController(tripWaypointsBlock, this._dataChangeHandler, this._viewChangeHandler);

        this._PointControllers.push(_PointController);

        _PointController.render(waypoint, PointControllerMode.DEFAULT);
      });
    });
  }

  init() {
    this._Sort = new Sort(sortOptions);
    this._RouteTrip = new RouteTrip(this._Waypoints.getWaypoints());

    render(this._container, this._Sort);
    render(this._container, this._RouteTrip);

    this._Waypoints.filterChangeHandler(this._filterChangeHandler);

    const sortButtons = document.querySelectorAll(`.trip-sort__btn`);

    sortButtons.forEach((sortButton) => {
      this._Sort.setSortClickHandler(sortButton, this._sortClickHandler);
    });

    const addWaypointButton = document.querySelector(`.trip-main__event-add-btn`);

    addWaypointButton.addEventListener(`click`, (evt) => {
      evt.target.disabled = true;
      const _newPointController = new PointController(this._container, this._dataChangeHandler, null);

      _newPointController.render(null, PointControllerMode.ADDING);
    });

    this.renderWaypoints(this._Sort.activeSortType);
  }
}
