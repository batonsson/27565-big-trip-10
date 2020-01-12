import {Utils} from '../utils';

export class RouteInfo {
  constructor(waypoints) {
    this._waypoints = waypoints;
    this._cost = this._getRouteCost();
  }

  get cost() {
    return this._cost;
  }

  _fetchRouteCities(waypoints) {
    const cities = [];

    waypoints.forEach((waypoint) => {
      cities.push(waypoint.city);
    });

    return cities;
  }

  _fetchRouteDate(waypoints) {
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
  }

  _fetchRouteInfo(waypoints) {
    return {
      cities: this._fetchRouteCities(waypoints),
      date: this._fetchRouteDate(waypoints)
    };
  }

  _createCitiesMarkup(cities) {
    const citiesMarkup = cities.join(`, `);

    return `<h1 class="trip-info__title">${citiesMarkup}</h1>`;
  }

  _createDateMarkup(date) {
    const {start, end} = date;

    return `${start} &mdash; ${end}`;
  }

  _getRouteCost() {
    let total = 0;

    this._waypoints.forEach((waypoint) => {
      const {price, offers} = waypoint;

      total += price;

      offers.forEach((offer) => {
        total += offer.price;
      });
    });

    return total;
  }

  getTemplate() {
    const route = this._fetchRouteInfo(this._waypoints);

    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">${this._createCitiesMarkup(route.cities)}</h1>

        <p class="trip-info__dates">${this._createDateMarkup(route.date)}</p>
      </div>`
    );
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
