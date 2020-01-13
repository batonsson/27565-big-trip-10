import {TYPES, CITIES, OFFERS} from '../const';
import Utils from '../utils';

const createTypeOptionMarkup = (type) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type.value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.value}" checked>
      <label class="event__type-label  event__type-label--${type.value}" for="event-type-${type.value}-1">${Utils.capitalizeFirstLetter(type.value)}</label>
    </div>`
  );
};

const createTypeListMarkup = (types, group) => {
  let waipointTypeOptionsMarkup = ``;

  types.forEach((type) => {
    if (type.group === group) {
      waipointTypeOptionsMarkup += createTypeOptionMarkup(type);
    }
  });

  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">${Utils.capitalizeFirstLetter(group)}</legend>
      ${waipointTypeOptionsMarkup}
    </fieldset>`
  );
};

const createCityOptionMarkup = (city) => {
  return `<option value="${city}"></option>`;
};

const createCityDatalistMarkup = (cities) => {
  let cityDatalistMarkup = ``;

  cities.forEach((city) => {
    cityDatalistMarkup += createCityOptionMarkup(city);
  });

  return (
    `<datalist id="destination-list-1">
      ${cityDatalistMarkup}
    </datalist>`
  );
};

const createOfferMarkup = (offer, isChecked) => {
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
};

const createOfferListMarkup = (offersGlobal, offersGiven) => {
  let offersMarkup = ``;

  offersGlobal.forEach((offerGlobal) => {
    const isChecked = offersGiven.filter((offerGiven) => offerGlobal.type === offerGiven.type).length > 0;

    offersMarkup += createOfferMarkup(offerGlobal, isChecked);
  });

  return (
    `<div class="event__available-offers">
      ${offersMarkup}
    </div>`
  );
};

const createPhotoMarkup = (photo) => {
  return (
    `<img class="event__photo" src="${photo}" alt="Event photo">`
  );
};

const createPhotoListMarkup = (photos) => {
  let photosMarkup = ``;

  photos.forEach((sight) => {
    photosMarkup += createPhotoMarkup(sight);
  });

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photosMarkup}
      </div>
    </div>`
  );
};

const getWaypointEditMarkup = (waypoint) => {
  const {type, city, time, price, offers, destination, photos} = waypoint;

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              ${createTypeListMarkup(TYPES, `transfer`)}
              ${createTypeListMarkup(TYPES, `activity`)}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${Utils.capitalizeFirstLetter(type)} at
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
            ${createCityDatalistMarkup(CITIES)}
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${time.start.F}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${time.end.F}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            ${createOfferListMarkup(OFFERS, offers)}
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination}</p>

            ${createPhotoListMarkup(photos)}
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class WaypointEdit {
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
    return getWaypointEditMarkup(this);
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
