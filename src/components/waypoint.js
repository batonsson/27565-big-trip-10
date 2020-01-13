import Utils from '../utils';

const createOfferMarkup = (offer) => {
  const {type, price} = offer;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${type}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </li>`
  );
};

const createOfferListMarkup = (offers) => {
  let offersMarkup = ``;

  offers.forEach((offer) => {
    offersMarkup += createOfferMarkup(offer);
  });

  return (
    `<ul class="event__selected-offers">
      ${offersMarkup}
    </ul>`
  );
};

const createWaypointMarkup = (waypoint) => {
  const {type, time, price, offers} = waypoint;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${Utils.capitalizeFirstLetter(type)}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${time.start.DT}">${time.start.HM}</time>
            &mdash;
            <time class="event__end-time" datetime="${time.end.DT}">${time.end.HM}</time>
          </p>
          <p class="event__duration">${time.diff.formatted}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        ${createOfferListMarkup(offers)}

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Waypoint {
  constructor(waypoint) {
    const {type, city, time, price, offers, destination, photos} = waypoint;

    this._type = type;
    this._city = city;
    this._time = time;
    this._price = price;
    this._offers = offers;
    this._destination = destination;
    this._photos = photos;
    this._element = null;
  }

  get type() {
    return this._type;
  }

  get city() {
    return this._city;
  }

  get time() {
    return this._time;
  }

  get price() {
    return this._price;
  }

  get offers() {
    return this._offers;
  }

  get destination() {
    return this._destination;
  }

  get photos() {
    return this._photos;
  }

  getTemplate() {
    return createWaypointMarkup(this);
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }

    return this._element;
  }

  changeElement(isEdit) {
    if (isEdit) {
      this._element.parentNode.replaceChild(this._element, this._edit);
    } else {
      this._edit.parentNode.replaceChild(this._edit, this._element);
    }
  }

  removeElement() {
    this._element = null;
  }
}
