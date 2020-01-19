import {TYPES, CITIES, OFFERS} from '../const';
import Utils from '../utils';

import moment from 'moment';

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
  const dateFrom = moment.utc(start);
  const dateTo = moment.utc(end);

  const raw = dateTo - dateFrom;
  const days = moment.duration(dateTo.diff(dateFrom)).days();
  const hours = moment.duration(dateTo.diff(dateFrom)).hours();
  const minutes = moment.duration(dateTo.diff(dateFrom)).minutes();
  const formatted = `${days ? days + `D` : `` } ${days || hours ? hours + `H` : `` } ${minutes ? minutes + `M` : `` }`.trim();

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
      F: moment(start).format(`DD/MM/YY HH:mm`),
      HM: moment(start).format(`HH:mm`),
      DT: `${moment(start).format(`YYY-M-DD`)}T${moment(start).format(`HH:mm`)}`,
      MD: moment(start).format(`MMM DD`)
    },
    end: {
      raw: end,
      F: moment(end).format(`DD/MM/YY HH:mm`),
      HM: moment(end).format(`HH:mm`),
      DT: `${moment(end).format(`YYY-M-DD`)}T${moment(end).format(`HH:mm`)}`,
      MD: moment(end).format(`MMM DD`)
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
  window.moment = moment;
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
