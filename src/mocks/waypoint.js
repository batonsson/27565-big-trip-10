import {TYPES, CITIES, OFFERS} from '../const';
import {
  getRandomNumber,
  getRandomArrayItem,
  getRandomDate,
  formatDate
} from '../utils';

const DESTINATION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

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
  return getRandomArrayItem(TYPES).value;
};

const getCity = () => {
  return getRandomArrayItem(CITIES);
};

const getTimeDiff = (start, end) => {
  const MS_DAY = 1000 * 60 * 60 * 24;
  const minutesOverlap = end.getMinutes() > start.getMinutes(); // if false hour diff must be less by 1
  let days = Math.floor((end - start) / MS_DAY);
  let hours =
    end.getHours() > start.getHours()
      ? end.getHours() - start.getHours() - Number(!minutesOverlap)
      : 24 - Math.abs(end.getHours() - start.getHours()) - Number(!minutesOverlap);
  let minutes =
    minutesOverlap
      ? end.getMinutes() - start.getMinutes()
      : 60 - Math.abs(end.getMinutes() - start.getMinutes());

  // ensure situations like 23H 60M will not happen
  if (minutes === 60) {
    hours++;
    minutes = 0;
  }

  if (hours === 24) {
    days++;
    hours = 0;
  }

  const formatted = `${days ? days + `D` : `` } ${hours ? hours + `H` : `` } ${minutes ? minutes + `M` : `` }`.trim();

  return {
    days,
    hours,
    minutes,
    formatted
  };
};

const getTime = () => {
  let start = getRandomDate();
  let end = getRandomDate();

  if (end < start) {
    [start, end] = [end, start];
  }

  const time = {
    start: {
      raw: start,
      F: formatDate(start, `F`),
      HM: formatDate(start, `HM`),
      DT: formatDate(start, `DT`),
      MD: formatDate(start, `MD`)
    },
    end: {
      raw: end,
      F: formatDate(end, `F`),
      HM: formatDate(end, `HM`),
      DT: formatDate(end, `DT`),
      MD: formatDate(end, `MD`)
    },
    diff: getTimeDiff(start, end)
  };

  return time;
};

const getPrice = () => {
  return getRandomNumber(10, 1000);
};

const getOffers = () => {
  const offers = new Set();
  const count = getRandomNumber(0, OFFERS_LIMIT);

  for (let i = 0; i < count; i++) {
    offers.add(getRandomArrayItem(OFFERS));
  }

  return Array.from(offers);
};

const getDestination = () => {
  let destination = ``;
  const sentences = DESTINATION.split(`.`);
  const count = getRandomNumber(1, DESTINATION_SENTENCE_LIMIT);

  for (let i = 0; i < count; i++) {
    destination += ` ${getRandomArrayItem(sentences).trim()}`;
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
