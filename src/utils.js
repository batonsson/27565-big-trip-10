import {MONTHS} from './const';

export const getRandomNumber = (min, max) => {
  return min + Math.round(max * Math.random());
};

export const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

export const getRandomArrayItem = (array) => {
  const index = getRandomNumber(0, array.length - 1);

  return array[index];
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const getRandomDate = () => {
  const date = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffDay = sign * getRandomNumber(0, 1);
  const diffHours = sign * getRandomNumber(0, 4);
  const diffMinutes = sign * getRandomNumber(0, 12);

  date.setDate(date.getDate() + diffDay);
  date.setHours(date.getHours() + diffHours);
  date.setMinutes(date.getMinutes() + diffMinutes);

  return date;
};

export const formatDate = (date, format) => {
  let dateFormatted = ``;

  switch (format) {
    case `F`:
      dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() % 100} ${castTimeFormat(date.getHours())}:${castTimeFormat(date.getMinutes())}`;
      break;
    case `HM`:
      dateFormatted = `${castTimeFormat(date.getHours())}:${castTimeFormat(date.getMinutes())}`;
      break;
    case `DT`:
      dateFormatted = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${castTimeFormat(date.getHours())}:${castTimeFormat(date.getMinutes())}`;
      break;
    case `MD`: {
      dateFormatted = `${MONTHS.shorthands[date.getMonth()].toUpperCase()} ${date.getDate()}`;
      break;
    }
    default:
      dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() % 100} ${castTimeFormat(date.getHours())}:${castTimeFormat(date.getMinutes())}`;
  }

  return dateFormatted;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
