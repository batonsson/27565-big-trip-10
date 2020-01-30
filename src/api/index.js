import Waypoint from '../models/waypoint';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ResponseStatus = {
  SUCCESS: 200,
  REDIRECT: 300
};

const checkStatus = (response) => {
  if (response.status >= ResponseStatus.SUCCESS && response.status < ResponseStatus.REDIRECT) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class Api {
  constructor(endPoint, auth) {
    this._endPoint = endPoint;
    this._auth = auth;
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._auth);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  getWaypoints() {
    const params = {
      url: `points`
    };

    return this._load(params)
      .then((response) => response.json())
      .then(Waypoint.parseWaypoints);
  }

  getDestinations() {
    const params = {
      url: `destinations`
    };

    return this._load(params)
      .then((response) => response.json());
  }

  getOffers() {
    const params = {
      url: `offers`
    };

    return this._load(params)
      .then((response) => response.json());
  }

  addWaypoint(waypoint) {
    const params = {
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(waypoint.toRaw()),
      headers: new Headers({'Content-Type': `application/json`})
    };

    return this._load(params)
      .then((response) => response.json())
      .then(Waypoint.parseWaypoint);
  }

  saveWaypoint(waypoint) {
    const params = {
      url: `points/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(waypoint.toRaw()),
      headers: new Headers({'Content-Type': `application/json`})
    };

    return this._load(params)
      .then((response) => response.json())
      .then(Waypoint.parseWaypoint);
  }

  deleteWaypoint(waypoint) {
    const params = {
      url: `points/${waypoint.id}`,
      method: Method.DELETE,
      headers: new Headers({'Content-Type': `application/json`})
    };

    return this._load(params);
  }

  sync(waypoints) {
    const params = {
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(waypoints),
      headers: new Headers({'Content-Type': `application/json`})
    };

    return this._load(params)
      .then((response) => response.json());
  }
}
