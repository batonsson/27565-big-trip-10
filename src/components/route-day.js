import Utils from '../utils';

const createRouteDayMarkup = (date, dayNumber) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="2019-03-18">${date.formatted}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class RouteDay {
  constructor(day) {
    const {date, waypoints, index} = day;

    this._date = date;
    this._waypoints = waypoints;
    this._index = index;
  }

  get waypoints() {
    return this._waypoints;
  }

  getTemplate() {
    return createRouteDayMarkup(this._date, this._index);
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate(this));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
