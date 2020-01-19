import {FilterType} from '../const';

export default class Waypoints {
  constructor(waypoints) {
    this._waypoints = waypoints;
    this._filter = FilterType.EVERYTHING;
  }

  getWaypoints() {
    let waypoints = [];

    switch (this._filter) {
      case FilterType.EVERYTHING:
        waypoints = this._waypoints.slice();
        break;
      case FilterType.FUTURE:
        waypoints = this._waypoints.filter((waypoint) => {
          return new Date() - waypoint.time.start.raw < 0;
        }).slice();
        break;
      case FilterType.PAST:
        waypoints = this._waypoints.filter((waypoint) => {
          return new Date() - waypoint.time.end.raw > 0;
        }).slice();
        break;
    }

    return waypoints;
  }

  setWaypoints(waypoints) {
    this._waypoints = waypoints;
  }

  updateWaypoint(id, waypoint) {
    this._waypoints[id] = waypoint;
  }

  setFilter(filter) {
    this._filter = filter;
    this._tripHandler();
  }

  filterChangeHandler(tripHandler) {
    this._tripHandler = tripHandler;
  }
}
