import AbstractComponent from './abstract-component';
import Utils from '../utils/utils';

const createOfferMarkup = (offer) => {
  const {title, price} = offer;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
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
    `<div class="event">
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

      ${offers.length ? `
        <h4 class="visually-hidden">Offers:</h4>
        ${createOfferListMarkup(offers)}
      ` : ``}

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`
  );
};

export default class Waypoint extends AbstractComponent {
  constructor(waypoint) {
    super();

    const {id, type, time, price, offers, destination, isFavorite} = waypoint;

    this._id = id;
    this._type = type;
    this._time = time;
    this._price = price;
    this._offers = offers;
    this._destination = destination;
    this._isFavorite = isFavorite;
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
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

  get isFavorite() {
    return this._isFavorite;
  }

  setOpenWaypointEditHandler(openWaypointEditHandler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, openWaypointEditHandler);
  }

  getTemplate() {
    return createWaypointMarkup(this);
  }
}
