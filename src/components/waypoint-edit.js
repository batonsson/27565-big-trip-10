import {TYPES, CITIES, OFFERS} from '../const';
import {Utils} from '../utils';

export class WaypointEdit {
  constructor(waypoint) {
    const {type, city, time, price, offers, destination, photos} = waypoint;

    this._type = type;
    this._city = city;
    this._time = time;
    this._price = price;
    this._offers = offers;
    this._destination = destination;
    this._photos = photos;
  }

  _createTypeOptionMarkup(type) {
    return (
      `<div class="event__type-item">
        <input id="event-type-${type.value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.value}" checked>
        <label class="event__type-label  event__type-label--${type.value}" for="event-type-${type.value}-1">${Utils.capitalizeFirstLetter(type.value)}</label>
      </div>`
    );
  }

  _createTypeListMarkup(types, group) {
    let waipointTypeOptionsMarkup = ``;

    types.forEach((type) => {
      if (type.group === group) {
        waipointTypeOptionsMarkup += this._createTypeOptionMarkup(type);
      }
    });

    return (
      `<fieldset class="event__type-group">
        <legend class="visually-hidden">${Utils.capitalizeFirstLetter(group)}</legend>
        ${waipointTypeOptionsMarkup}
      </fieldset>`
    );
  }

  _createCityOptionMarkup(city) {
    return `<option value="${city}"></option>`;
  }

  _createCityDatalistMarkup(cities) {
    let cityDatalistMarkup = ``;

    cities.forEach((city) => {
      cityDatalistMarkup += this._createCityOptionMarkup(city);
    });

    return (
      `<datalist id="destination-list-1">
        ${cityDatalistMarkup}
      </datalist>`
    );
  }

  _createOfferMarkup(offer, isChecked) {
    const {type, price} = offer;

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" ${isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${type}-1">
          <span class="event__offer-title">${type}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${price}</span>
        </label>
      </div>`
    );
  }

  _createOfferListMarkup(offersGlobal, offersGiven) {
    let offersMarkup = ``;

    offersGlobal.forEach((offerGlobal) => {
      const isChecked = offersGiven.filter((offerGiven) => offerGlobal.type === offerGiven.type).length > 0;

      offersMarkup += this._createOfferMarkup(offerGlobal, isChecked);
    });

    return (
      `<div class="event__available-offers">
        ${offersMarkup}
      </div>`
    );
  }

  _createPhotoMarkup(photo) {
    return (
      `<img class="event__photo" src="${photo}" alt="Event photo">`
    );
  }

  _createPhotoListMarkup(photos) {
    let photosMarkup = ``;

    photos.forEach((sight) => {
      photosMarkup += this._createPhotoMarkup(sight);
    });

    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${photosMarkup}
        </div>
      </div>`
    );
  }

  getTemplate(isNew) {
    const waypointClassName = isNew ? `trip-events__item  event  event--edit` : `event  event--edit`;

    return (
      `<li class="trip-events__item">
        <form class="${waypointClassName}" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

              <div class="event__type-list">
                ${this._createTypeListMarkup(TYPES, `transfer`)}
                ${this._createTypeListMarkup(TYPES, `activity`)}
              </div>
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                ${Utils.capitalizeFirstLetter(this._type)} at
              </label>
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
              ${this._createCityDatalistMarkup(CITIES)}
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">
                From
              </label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._time.start.F}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">
                To
              </label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._time.end.F}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Cancel</button>
          </header>
          ${!isNew ? `<section class="event__details">
                        <section class="event__section  event__section--offers">
                          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                          ${this._createOfferListMarkup(OFFERS, this._offers)}
                        </section>

                        <section class="event__section  event__section--destination">
                          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                          <p class="event__destination-description">${this._destination}</p>

                          ${this._createPhotoListMarkup(this._photos)}
                        </section>
                      </section>` : ``}
        </form>
      </li>`
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
