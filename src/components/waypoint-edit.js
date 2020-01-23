import AbstractSmartComponent from './abstract-smart-component';
import {TYPES} from '../utils/const';
import Utils from '../utils/utils';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const createTypeOptionMarkup = (type, currentType) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${type.value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type.value}" ${type.value === currentType ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type.value}" for="event-type-${type.value}-1">${Utils.capitalizeFirstLetter(type.value)}</label>
    </div>`
  );
};

const createTypeListMarkup = (types, group, currentType) => {
  let waipointTypeOptionsMarkup = ``;

  types.forEach((type) => {
    if (type.group === group) {
      waipointTypeOptionsMarkup += createTypeOptionMarkup(type, currentType);
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
  return `<option value="${city}">`;
};

const createCityDatalistMarkup = (destinations) => {
  let cityDatalistMarkup = ``;

  destinations.forEach((destination) => {
    cityDatalistMarkup += createCityOptionMarkup(destination.name);
  });

  return (
    `<datalist id="destination-list-1">
      ${cityDatalistMarkup}
    </datalist>`
  );
};

const createOfferMarkup = (offer, isChosen) => {
  const {title, price} = offer;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${isChosen ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${title}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createOfferListMarkup = (offersAll, offersChecked) => {
  let offersMarkup = ``;

  offersAll.forEach((offer) => {
    const isChosen = !!offersChecked.filter((offerChecked) => offerChecked.title === offer.title).length;
    offersMarkup += createOfferMarkup(offer, isChosen);
  });

  return (
    `<div class="event__available-offers">
      ${offersMarkup}
    </div>`
  );
};

const createPhotoMarkup = (photo) => {
  const {src, alt} = photo;

  return (
    `<img class="event__photo" src="${src}" alt="${alt}">`
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

const getWaypointEditMarkup = (waypoint, Data, isAddMode) => {
  const {type, time, price, offers, destination, isFavorite} = waypoint;
  const offersByType = Data.getOffersByType(type);
  const destinations = Data.getDestinations();
  const formClassName = isAddMode ? `trip-events__item  event event--edit` : `event event--edit`;
  const resetButtonText = isAddMode ? `Cancel` : `Delete`;
  const favoriteButton = isAddMode ? `` : `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
                                            <label class="event__favorite-btn" for="event-favorite-1">
                                              <span class="visually-hidden">Add to favorite</span>
                                              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                                                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                                              </svg>
                                            </label>`;
  const rollupButton = isAddMode ? `` : `<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>`;

  return (
    `<form class="${formClassName}" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            ${createTypeListMarkup(TYPES, `transfer`, type)}
            ${createTypeListMarkup(TYPES, `activity`, type)}
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${Utils.capitalizeFirstLetter(type)} at
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          ${createCityDatalistMarkup(destinations)}
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
        <button class="event__reset-btn" type="reset">${resetButtonText}</button>

        ${favoriteButton}

        ${rollupButton}
      </header>
      <section class="event__details">
        ${offersByType.length ? `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            ${createOfferListMarkup(offersByType, offers)}
          </section>
        ` : ``}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          ${createPhotoListMarkup(destination.pictures)}
        </section>
      </section>
    </form>`
  );
};

export default class WaypointEdit extends AbstractSmartComponent {
  constructor(waypoint, Data, isAddMode) {
    super();

    const {id, type, time, price, offers, destination, isFavorite} = waypoint;

    this._id = id;
    this._type = type;
    this._time = time;
    this._price = price;
    this._offers = offers;
    this._destination = destination;
    this._isFavorite = isFavorite;

    this._Data = Data;

    this._isAddMode = isAddMode;

    this._waypointReset = JSON.parse(JSON.stringify(waypoint));

    this._flatpickr = null;

    if (this._isAddMode) {
      this.applyFlatpickr();
    }
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

  get data() {
    return {
      id: this._id,
      type: this._type,
      time: this._time,
      price: this._price,
      offers: this._offers,
      destination: this._destination,
      isFavorite: this._isFavorite
    };
  }

  set data(waypoint) {
    const {id, type, time, price, offers, destination, isFavorite} = waypoint;

    this._id = id;
    this._type = type;
    this._time = time;
    this._price = price;
    this._offers = offers;
    this._destination = destination;
    this._isFavorite = isFavorite;
  }

  applyFlatpickr() {
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

  destroyFlatpickr() {
    if (this._flatpickrFrom) {
      this._flatpickrFrom.destroy();
      this._flatpickrFrom = null;
    }

    if (this._flatpickrTo) {
      this._flatpickrTo.destroy();
      this._flatpickrTo = null;
    }
  }

  resetWaypoint() {
    const {_type, _city, _time, _price, _offers, _destination, _photos} = this._waypointReset;

    this._type = _type;
    this._city = _city;
    this._time = _time;
    this._price = _price;
    this._offers = _offers;
    this._destination = _destination;
    this._photos = _photos;

    this.rerender();
  }

  setSubmitWaypointHandler(submitWaypointHandler) {
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, submitWaypointHandler);

    this._submitWaypointHandler = submitWaypointHandler;
  }

  setCloseWaypointEditHandlers(closeWaypointEditHandler) {
    this.getElement().addEventListener(`submit`, closeWaypointEditHandler);
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, closeWaypointEditHandler);

    this._closeWaypointEditHandler = closeWaypointEditHandler;
  }

  setDeleteWaypointHandler(deleteWaypointHandler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, deleteWaypointHandler);

    this._deleteWaypointHandler = deleteWaypointHandler;
  }

  setAddToFavoritesHandler(addToFavoritesHandler) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, () => {
      this._isFavorite = !this._isFavorite;
      addToFavoritesHandler();
    });

    this._addToFavoritesHandler = addToFavoritesHandler;
  }

  setChangeEventTypeHandler(changeEventTypeHandler) {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, (evt) => {
      this._type = evt.target.value;
      changeEventTypeHandler(evt);
    });

    this._changeEventTypeHandler = changeEventTypeHandler;
  }

  setChangeEventCityHandler(changeEventCityHandler) {
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, (evt) => {
      const newDestination = this._Data.getDestinationByCity(evt.target.value);

      this._destination.name = newDestination.name;
      this._destination.description = newDestination.description;
      this._destination.pictures = newDestination.pictures;

      changeEventCityHandler(evt);
    });

    this._changeEventCityHandler = changeEventCityHandler;
  }

  recoveryListeners() {
    if (this._isAddMode) {
      this.setDeleteWaypointHandler(this._deleteWaypointHandler);
    } else {
      this.setAddToFavoritesHandler(this._addToFavoritesHandler);
      this.setCloseWaypointEditHandlers(this._closeWaypointEditHandler);
    }

    this.setSubmitWaypointHandler(this._submitWaypointHandler);
    this.setChangeEventTypeHandler(this._changeEventTypeHandler);
    this.setChangeEventCityHandler(this._changeEventCityHandler);
  }

  getTemplate() {
    return getWaypointEditMarkup(this, this._Data, this._isAddMode);
  }

  removeElement() {
    this.destroyFlatpickr();
    super.removeElement();
  }
}
