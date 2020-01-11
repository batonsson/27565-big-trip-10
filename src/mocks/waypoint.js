import {
  getRandomNumber,
  getRandomArrayItem,
  getRandomDate,
  formatDate
} from "../utils";

const TYPES = [
  `bus`,
  `check`,
  `drive`,
  `flight`,
  `restaurant`,
  `ship`,
  `sightseeing`,
  `taxi`,
  `train`,
  `transport`
];

const CITIES = [
  `Kaliningrad`,
  `London`,
  `Protaras`,
  `Valetta`,
  `Strasbourg`,
  `Amsterdam`
];

const DESTINATION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const OFFERS = [
  {
    type: `Add luggage`,
    price: 20
  },
  {
    type: `Switch to comfort class`,
    price: 40
  },
  {
    type: `Add meal`,
    price: 10
  },
  {
    type: `Choose seats`,
    price: 10
  }
];

const DESTINATION_SENTENCE_LIMIT = 2;
const OFFERS_LIMIT = 2;
const SIGHTS_LIMIT = 6;

function Waypoint(type, city, time, price, offers, destination, sights) {
  this.type = type;
  this.city = city;
  this.time = time;
  this.price = price;
  this.offers = offers;
  this.destination = destination;
  this.sights = sights;
}

const getType = () => {
  return getRandomArrayItem(TYPES);
};

const getCity = () => {
  return getRandomArrayItem(CITIES);
};

const getTimeDiff = (start, end) => {
  const MS_DAY = 1000 * 60 * 60 * 24;
  const minutesOverlap = end.getMinutes() - start.getMinutes() > 0; // if false hour diff must be less by 1
  const hours =
    end.getHours() - start.getHours() > 0
      ? end.getHours() - start.getHours()
      : 24 - Math.abs(end.getHours() - start.getHours()) - Number(!minutesOverlap);
  const minutes =
    minutesOverlap
      ? end.getMinutes() - start.getMinutes()
      : 60 - Math.abs(end.getMinutes() - start.getMinutes());

  return {
    days: Math.floor((end - start) / MS_DAY),
    hours,
    minutes
  };
};

const getTime = () => {
  let start = getRandomDate();
  let end = getRandomDate();

  if (end < start) {
    [start, end] = [end, start];
  }

  let diff = getTimeDiff(start, end);

  start = formatDate(start);
  end = formatDate(end);

  const time = {
    start,
    end,
    diff
  };

  return time;
};

const getPrice = () => {
  return getRandomNumber(10, 1000);
};

const getOffers = () => {
  const offers = [];
  const count = getRandomNumber(0, OFFERS_LIMIT);

  for (let i = 0; i < count; i++) {
    offers.push(getRandomArrayItem(OFFERS));
  }

  return offers;
};

const getDestination = () => {
  let destination = ``;
  const count = getRandomNumber(1, DESTINATION_SENTENCE_LIMIT);

  for (let i = 0; i < count; i++) {
    destination += ` ${getRandomArrayItem(DESTINATION)}`;
  }

  return destination;
};

const getSights = () => {
  const sights = [];
  const count = getRandomNumber(1, SIGHTS_LIMIT);

  for (let i = 0; i < count; i++) {
    sights.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }

  return sights;
};

export const createWaypoint = () => {
  return new Waypoint(
      getType(),
      getCity(),
      getTime(),
      getPrice(),
      getOffers(),
      getDestination(),
      getSights()
  );
};
