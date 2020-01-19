import {sortOptions} from '../mocks/sort';

import RouteTrip from './route-trip';
import RouteDay from './route-day';
import Sort from './sort';
import PointController, {Mode as PointControllerMode} from './PointController';

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
  constructor(waypoints, container) {
    this._waypoints = waypoints;
    this._container = container;
    this._PointControllers = [];

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
  }

  _dataChangeHandler(_PointController, oldData, newData) {
    _PointController.destroy();

    this._waypoints[this._waypoints.indexOf(oldData)] = newData;

    _PointController.render(newData, PointControllerMode.DEFAULT);
  }

  _sortClickHandler(sortType) {
    this.renderWaypoints(sortType);
  }

  _viewChangeHandler() {
    this._PointControllers.forEach((pointController) => {
      pointController.setDefaultView();
    });
  }

  set RouteTrip(_RouteTrip) {
    this._RouteTrip = _RouteTrip;
  }

  renderWaypoints(sortType) {
    const tripDayListBlock = this._container.querySelector(`.trip-days`);

    tripDayListBlock.innerHTML = ``;

    let dayList;

    switch (sortType) {
      case `event`:
        dayList = this._RouteTrip.fetchDayList();
        break;
      default:
        dayList = [
          {
            date: null,
            waypoints: sortWaypoints(this._waypoints.slice(), sortType),
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
    const _Sort = new Sort(sortOptions);
    const _RouteTrip = new RouteTrip(this._waypoints);

    this.RouteTrip = _RouteTrip;

    render(this._container, _Sort);
    render(this._container, _RouteTrip);

    const sortButtons = document.querySelectorAll(`.trip-sort__btn`);

    sortButtons.forEach((sortButton) => {
      _Sort.setSortClickHandler(sortButton, this._sortClickHandler);
    });

    this.renderWaypoints(_Sort.activeSortType);
  }
}
