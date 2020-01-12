import {Utils} from '../utils';

export class RouteTrip {
  constructor(waypoints) {
    this._waypoints = waypoints;
  }

  _checkDayExists(dayGiven, dayList) {
    const check = {
      exists: false,
      index: null
    };

    check.exists = dayList.some((dayExisting, index) => {
      const exists = dayExisting.date.formatted === dayGiven.time.start.MD;

      if (exists) {
        check.index = index;
      }

      return exists;
    });

    return check;
  }

  _fetchDayList(waypoints) {
    const dayList = [];

    waypoints.forEach((waypoint) => {
      const {exists, index} = this._checkDayExists(waypoint, dayList);

      if (exists) {
        dayList[index].waypoints.push(waypoint);
      } else {
        dayList.push({
          date: {
            raw: waypoint.time.start.raw,
            formatted: waypoint.time.start.MD
          },
          waypoints: [waypoint]
        });
      }
    });

    return dayList;
  }

  _createRouteWaypointsMarkup(waypoints) {
    let routeWaypointsMarkup = ``;

    waypoints.forEach((waypoint) => {
      routeWaypointsMarkup += waypoint.getTemplate();
    });

    return routeWaypointsMarkup;
  }

  _createRouteDayMarkup(day, dayNumber) {
    const {date, waypoints} = day;

    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${dayNumber}</span>
          <time class="day__date" datetime="2019-03-18">${date.formatted}</time>
        </div>

        <ul class="trip-events__list">
          ${this._createRouteWaypointsMarkup(waypoints)}
        </ul>
      </li>`
    );
  }

  getTemplate() {
    const dayList = this._fetchDayList(this._waypoints).sort((a, b) => {
      return a.date.raw > b.date.raw ? 1 : -1;
    });

    let dayListMarkup = ``;

    dayList.forEach((day, index) => {
      dayListMarkup += this._createRouteDayMarkup(day, index + 1);
    });

    return (
      `<ul class="trip-days">
        ${dayListMarkup}
      <ul>`
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
