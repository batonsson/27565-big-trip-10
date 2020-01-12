import {Utils} from '../utils';
import {WaypointEdit} from './waypoint-edit';

export class Waypoint {
  constructor(type, city, time, price, offers, destination, photos) {
    this._type = type;
    this._city = city;
    this._time = time;
    this._price = price;
    this._offers = offers;
    this._destination = destination;
    this._photos = photos;
    this._edit = new WaypointEdit(this).getElement();
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

  _createOfferMarkup(offer) {
    const {type, price} = offer;
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${type}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </li>`
    );
  }

  _createOfferListMarkup() {
    let offersMarkup = ``;

    this._offers.forEach((offer) => {
      offersMarkup += this._createOfferMarkup(offer);
    });

    return (
      `<ul class="event__selected-offers">
        ${offersMarkup}
      </ul>`
    );
  }

  getTemplate() {
    return (
      `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${Utils.capitalizeFirstLetter(this._type)}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${this._time.start.DT}">${this._time.start.HM}</time>
              &mdash;
              <time class="event__end-time" datetime="${this._time.end.DT}">${this._time.end.HM}</time>
            </p>
            <p class="event__duration">${this._time.diff.formatted}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this._price}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          ${this._createOfferListMarkup(this._offers)}

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`
    );
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
