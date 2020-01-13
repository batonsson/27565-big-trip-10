import Utils from '../utils';

const fetchRouteCities = (waypoints) => {
  const cities = [];

  waypoints.forEach((waypoint) => {
    cities.push(waypoint.city);
  });

  return cities;
};

const fetchRouteDate = (waypoints) => {
  const date = {
    start: null,
    end: null
  };

  waypoints.forEach((waypoint) => {
    if (waypoint.time.start.raw < date.start || date.start === null) {
      date.start = waypoint.time.start.MD;
    }

    if (waypoint.time.end.raw > date.end || date.end === null) {
      date.end = waypoint.time.end.MD;
    }
  });

  return date;
};

const fetchRouteInfo = (waypoints) => {
  return {
    cities: fetchRouteCities(waypoints),
    date: fetchRouteDate(waypoints)
  };
};

const createCitiesMarkup = (cities) => {
  const citiesMarkup = cities.join(`, `);

  return (
    `<h1 class="trip-info__title">${citiesMarkup}</h1>`
  );
};

const createDateMarkup = (date) => {
  const {start, end} = date;

  return (
    `${start} &mdash; ${end}`
  );
};

const getRouteCost = (waypoints) => {
  let total = 0;

  waypoints.forEach((waypoint) => {
    const {price, offers} = waypoint;

    total += price;

    offers.forEach((offer) => {
      total += offer.price;
    });
  });

  return total;
};

const getRouteMarkup = (waypoints) => {
  const route = fetchRouteInfo(waypoints);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${createCitiesMarkup(route.cities)}</h1>

      <p class="trip-info__dates">${createDateMarkup(route.date)}</p>
    </div>`
  );
};

export default class RouteInfo {
  constructor(waypoints) {
    this._waypoints = waypoints;
    this._cost = getRouteCost(this._waypoints);
    this._element = null;
  }

  get cost() {
    return this._cost;
  }

  getTemplate() {
    return getRouteMarkup(this._waypoints);
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
