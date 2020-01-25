import {FilterType} from '../utils/const';

const getWaypointIndex = (waypoints, id) => {
  let index = null;

  waypoints.forEach((existingWaypoint, i) => {
    if (existingWaypoint.id === id) {
      index = i;
    }
  });

  return index;
};

export default class Waypoints {
  constructor() {
    this._waypoints = [];
    this._filter = FilterType.EVERYTHING;
  }

  getWaypoints() {
    let waypoints = [];

    switch (this._filter) {
      case FilterType.EVERYTHING:
        waypoints = this._waypoints;
        break;
      case FilterType.FUTURE:
        waypoints = this._waypoints.filter((waypoint) => {
          return new Date() - waypoint.time.start.raw < 0;
        });
        break;
      case FilterType.PAST:
        waypoints = this._waypoints.filter((waypoint) => {
          return new Date() - waypoint.time.end.raw > 0;
        });
        break;
    }

    return waypoints.slice();
  }

  setWaypoints(waypoints) {
    this._waypoints = waypoints;
  }

  setFilter(filter) {
    this._filter = filter;
    this._tripHandler();
  }

  filterChangeHandler(tripHandler) {
    this._tripHandler = tripHandler;
  }

  addWaypoint(waypoint) {
    this._waypoints.unshift(waypoint);
  }

  updateWaypoint(waypoint) {
    const index = getWaypointIndex(this._waypoints, waypoint.id);
    this._waypoints[index] = waypoint;
  }

  deleteWaypoint(id) {
    const index = getWaypointIndex(this._waypoints, id);
    this._waypoints.splice(index, 1);
  }
}
