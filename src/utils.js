export const getRandomNumber = (min, max) => {
  return min + Math.round(max * Math.random());
};

export const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(0, array.length);

  return array[randomIndex];
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffDay = sign * getRandomNumber(0, 7);
  const diffHours = sign * getRandomNumber(0, 24);
  const diffMinutes = sign * getRandomNumber(0, 60);

  targetDate.setDate(targetDate.getDate() + diffDay);
  targetDate.setHours(targetDate.getHours() + diffHours);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutes);

  return targetDate;
};

export const formatDate = (date) => {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() % 100} ${castTimeFormat(date.getHours())}:${castTimeFormat(date.getMinutes())}`;
};
