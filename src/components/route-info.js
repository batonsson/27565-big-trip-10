import AbstractComponent from './abstract-component';
import Utils from '../utils/utils';

const fetchRouteCities = (waypoints) => {
  const cities = [];

  waypoints.forEach((waypoint) => {
    cities.push(waypoint.destination.name);
  });

  return cities;
};

const fetchRouteDate = (waypoints) => {
  return {
    start: waypoints[0].time.start.MD,
    end: waypoints[waypoints.length - 1].time.start.MD
  };
};

const fetchRouteInfo = (waypoints) => {
  const waypointsSorted = waypoints.slice().sort((prev, next) => prev.time.start.raw - next.time.start.raw);

  return {
    cities: fetchRouteCities(waypointsSorted),
    date: fetchRouteDate(waypointsSorted)
  };
};

const createCitiesMarkup = (cities) => {
  const citiesMarkup = cities.length < 3 ? cities.join(`, `) : `${cities[0]} — ... — ${cities[cities.length - 1]}`;

  return (
    `${citiesMarkup}`
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
  const citiesMarkup = waypoints.length ? createCitiesMarkup(fetchRouteInfo(waypoints).cities) : ``;
  const dateMarkup = waypoints.length ? createDateMarkup(fetchRouteInfo(waypoints).date) : ``;

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${citiesMarkup}</h1>
      <p class="trip-info__dates">${dateMarkup}</p>
    </div>`
  );
};

export default class RouteInfo extends AbstractComponent {
  constructor(waypoints) {
    super();

    this._waypoints = waypoints;
  }

  getTemplate() {
    return getRouteMarkup(this._waypoints);
  }

  getElement() {
    document.querySelector(`.trip-info__cost-value`).textContent = getRouteCost(this._waypoints);

    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }

    return this._element;
  }

  recalculate(waypoints) {
    this._waypoints = waypoints;
    const oldElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();
    Utils.replaceElement(oldElement, newElement);
  }
}
