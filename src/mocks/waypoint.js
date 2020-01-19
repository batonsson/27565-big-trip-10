import {TYPES, CITIES, OFFERS} from '../const';
import Utils from '../utils';

const DESTINATION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const DESTINATION_SENTENCE_LIMIT = 2;
const OFFERS_LIMIT = 2;
const PHOTOS_LIMIT = 6;

const getType = () => {
  return Utils.getRandomArrayItem(TYPES).value;
};

const getCity = () => {
  return Utils.getRandomArrayItem(CITIES);
};

const getTimeDiff = (start, end) => {
  const raw = end - start;
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
    raw,
    days,
    hours,
    minutes,
    formatted
  };
};

const getTime = () => {
  let start = Utils.getRandomDate();
  let end = Utils.getRandomDate();

  if (end < start) {
    [start, end] = [end, start];
  }

  const time = {
    start: {
      raw: start,
      F: Utils.formatDate(start, `F`),
      HM: Utils.formatDate(start, `HM`),
      DT: Utils.formatDate(start, `DT`),
      MD: Utils.formatDate(start, `MD`)
    },
    end: {
      raw: end,
      F: Utils.formatDate(end, `F`),
      HM: Utils.formatDate(end, `HM`),
      DT: Utils.formatDate(end, `DT`),
      MD: Utils.formatDate(end, `MD`)
    },
    diff: getTimeDiff(start, end)
  };

  return time;
};

const getPrice = () => {
  return Utils.getRandomNumber(10, 1000);
};

const getOffers = () => {
  const offers = new Set();
  const count = Utils.getRandomNumber(0, OFFERS_LIMIT);

  for (let i = 0; i < count; i++) {
    offers.add(Utils.getRandomArrayItem(OFFERS));
  }

  return Array.from(offers);
};

const getDestination = () => {
  let destination = ``;
  const sentences = DESTINATION.split(`.`);
  const count = Utils.getRandomNumber(1, DESTINATION_SENTENCE_LIMIT);

  for (let i = 0; i < count; i++) {
    destination += ` ${Utils.getRandomArrayItem(sentences).trim()}`;
  }

  return destination;
};

const getPhotos = () => {
  const photos = [];
  const count = Utils.getRandomNumber(1, PHOTOS_LIMIT);

  for (let i = 0; i < count; i++) {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }

  return photos;
};

export const createWaypoint = () => {
  return {
    type: getType(),
    city: getCity(),
    time: getTime(),
    price: getPrice(),
    offers: getOffers(),
    destination: getDestination(),
    photos: getPhotos(),
    isFavorite: false
  };
};
