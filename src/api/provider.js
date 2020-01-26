import Waypoint from '../models/waypoint';
import nanoid from 'nanoid';
import {StoreData} from '../utils/const';

const getSyncedWaypoints = (items) => {
  return items
    .filter(({success}) => {
      return success;
    })
    .map(({payload}) => {
      return payload.point;
    });
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  get isSynchronized() {
    return this._isSynchronized;
  }

  getWaypoints() {
    if (this._isOnline()) {
      return this._api.getWaypoints()
        .then((waypoints) => {
          waypoints.forEach((waypoint) => this._store.setItem(waypoint.id, waypoint.toRaw(), StoreData.WAYPOINTS));

          return waypoints;
        });
    }

    const storeWaypoints = Object.values(this._store.getByType(StoreData.WAYPOINTS));
    this._isSynchronized = false;

    return Promise.resolve(Waypoint.parseWaypoints(storeWaypoints));
  }

  addWaypoint(waypoint) {
    if (this._isOnline()) {
      return this._api.addWaypoint(waypoint)
        .then((newWaypoint) => {
          this._store.setItem(newWaypoint.id, Object.assign({}, newWaypoint.toRaw(), {offline: true}), StoreData.WAYPOINTS);

          return newWaypoint;
        });
    }

    const tempNewWaypointId = nanoid();
    const tempNewWaypoint = Waypoint.parseWaypoint(Object.assign({}, waypoint.toRaw(), {id: tempNewWaypointId}));
    this._store.setItem(tempNewWaypoint.id, Object.assign({}, tempNewWaypoint.toRaw(), {offline: true}), StoreData.WAYPOINTS);
    this._isSynchronized = false;

    return Promise.resolve(tempNewWaypoint);
  }

  saveWaypoint(waypoint) {
    if (this._isOnline()) {
      return this._api.saveWaypoint(waypoint)
        .then((newWaypoint) => {
          this._store.setItem(newWaypoint.id, Object.assign({}, newWaypoint.toRaw(), {offline: true}), StoreData.WAYPOINTS);

          return newWaypoint;
        });
    }

    const tempNewWaypoint = Waypoint.parseWaypoint(Object.assign({}, waypoint.toRaw()));
    this._store.setItem(tempNewWaypoint.id, Object.assign({}, tempNewWaypoint.toRaw(), {offline: true}), StoreData.WAYPOINTS);
    this._isSynchronized = false;

    return Promise.resolve(tempNewWaypoint);
  }

  deleteWaypoint(waypoint) {
    if (this._isOnline()) {
      return this._api.deleteWaypoint(waypoint)
        .then(() => {
          this._store.removeItem(waypoint.id);
        });
    }

    this._store.removeItem(waypoint.id);
    this._isSynchronized = false;

    return Promise.resolve();
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setItem(null, destinations, StoreData.DESTINATIONS);

          return destinations;
        });
    }

    const destinations = Object.values(this._store.getByType(StoreData.DESTINATIONS));
    this._isSynchronized = false;

    return Promise.resolve(destinations);
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setItem(null, offers, StoreData.OFFERS);

          return offers;
        });
    }

    const offers = Object.values(this._store.getByType(StoreData.OFFERS));
    this._isSynchronized = false;

    return Promise.resolve(offers);
  }

  sync() {
    if (this._isOnline()) {
      const waypoints = Object.values(this._store.getByType(StoreData.WAYPOINTS));

      return this._api.sync(waypoints)
        .then((response) => {
          waypoints
            .filter((waypoint) => {
              return waypoint.offline;
            })
            .forEach((waypoint) => {
              this._store.removeItem(waypoint.id);
            });

          const waypointsCreated = getSyncedWaypoints(response.created);
          const waypointsUpdated = getSyncedWaypoints(response.updated);

          [...waypointsCreated, ...waypointsUpdated].forEach((waypoint) => {
            this._store.setItem(waypoint.id, waypoint, StoreData.WAYPOINTS);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    this._isSynchronized = true;

    return Promise.reject(new Error(`Sync data failed`));
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
