import {TYPES, CITIES, OFFERS} from '../const';
import Utils from '../utils';
import AbstractSmartComponent from './AbstractSmartComponent';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

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
  const {type, city, time, price, offers, destination, photos, isFavorite} = waypoint;

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

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
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

export default class WaypointEdit extends AbstractSmartComponent {
  constructor(waypoint) {
    super();

    const {type, city, time, price, offers, destination, photos, isFavorite} = waypoint;

    this._type = type;
    this._city = city;
    this._time = time;
    this._price = price;
    this._offers = offers;
    this._destination = destination;
    this._photos = photos;
    this._isFavorite = isFavorite;

    this._flatpickr = null;

    this._applyFlatpickr();
  }

  _applyFlatpickr() {
    const inputFrom = this.getElement().querySelectorAll(`.event__input--time[name="event-start-time"]`);
    const inputTo = this.getElement().querySelectorAll(`.event__input--time[name="event-end-time"]`);

    const paramsFrom = {
      defaultDate: new Date(this._time.start.raw),
      dateFormat: `d/m/y H:i`,
      onChange: (dateFrom) => {
        this._time.start.raw = dateFrom[0];
        this._flatpickrTo.destroy();

        this._flatpickrTo = flatpickr(inputTo, {
          defaultDate: new Date(this._time.end.raw),
          dateFormat: `d/m/y H:i`,
          minDate: new Date(this._time.start.raw),
          onChange: (dateTo) => {
            this._time.end.raw = dateTo[0];
          }
        });
      }
    };

    const paramsTo = {
      defaultDate: new Date(this._time.end.raw),
      dateFormat: `d/m/y H:i`,
      minDate: new Date(this._time.start.raw),
      onChange: (dateTo) => {
        this._time.end.raw = dateTo[0];
      }
    };

    this._flatpickrFrom = flatpickr(inputFrom, paramsFrom);

    this._flatpickrTo = flatpickr(inputTo, paramsTo);
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

  get isFavorite() {
    return this._isFavorite;
  }

  setCloseWaypointEditHandlers(closeWaypointEditHandler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, closeWaypointEditHandler);

    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, closeWaypointEditHandler);

    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, closeWaypointEditHandler);

    this._closeWaypointEditHandler = closeWaypointEditHandler;
  }

  setAddToFavoritesHandler(dataChangeHandler) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, dataChangeHandler);

    this._dataChangeHandler = dataChangeHandler;
  }

  setChangeEventTypeHandler(changeEventTypeHandler) {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, changeEventTypeHandler);

    this._changeEventTypeHandler = changeEventTypeHandler;
  }

  setChangeEventCityHandler(changeEventCityHandler) {
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, changeEventCityHandler);

    this._changeEventCityHandler = changeEventCityHandler;
  }

  recoveryListeners() {
    this.setCloseWaypointHandlers(this._closeWaypointEditHandler);
    this.setAddToFavoritesHandler(this._dataChangeHandler);
    this.setChangeEventTypeHandler(this._changeEventTypeHandler);
    this.setChangeEventCityHandler(this._changeEventCityHandler);
  }

  getTemplate() {
    return getWaypointEditMarkup(this);
  }
}
