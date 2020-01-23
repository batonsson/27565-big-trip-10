import {FILTER_TYPE} from '../utils/const';

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
    this._filter = FILTER_TYPE.EVERYTHING;
  }

  getWaypoints() {
    let waypoints = [];

    switch (this._filter) {
      case FILTER_TYPE.EVERYTHING:
        waypoints = this._waypoints;
        break;
      case FILTER_TYPE.FUTURE:
        waypoints = this._waypoints.filter((waypoint) => {
          return new Date() - waypoint.time.start.raw < 0;
        });
        break;
      case FILTER_TYPE.PAST:
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
    waypoint.id = this._waypoints.length + 1;
    this._waypoints.unshift(waypoint);
  }

  updateWaypoint(id, waypoint) {
    const index = getWaypointIndex(this._waypoints, id);

    this._waypoints[index] = waypoint;
  }

  deleteWaypoint(id) {
    const index = getWaypointIndex(this._waypoints, id);

    this._waypoints.splice(index, 1);
  }
}
