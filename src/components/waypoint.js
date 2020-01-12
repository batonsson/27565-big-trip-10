import {capitalizeFirstLetter} from '../utils';

const createOfferMarkup = (offer) => {
  const {type, price} = offer;
  return `<li class="event__offer">
            <span class="event__offer-title">${type}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${price}</span>
          </li>`;
};

const createOfferListMarkup = (offers) => {
  let offersMarkup = ``;

  offers.forEach((offer) => {
    offersMarkup += createOfferMarkup(offer);
  });

  return `<ul class="event__selected-offers">
            ${offersMarkup}
          </ul>`;
};

const createWaypointMarkup = (waypoint) => {
  const {type, time, price, offers} = waypoint;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(type)}</h3>

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

export const createWaypoints = (waypoints) => {
  let waypointsMarkup = ``;

  waypoints.forEach((waypoint) => {
    waypointsMarkup += createWaypointMarkup(waypoint);
  });

  return waypointsMarkup;
};
