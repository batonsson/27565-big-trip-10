import {MONTHS} from './const';

export default class Utils {
  static getRandomNumber(min, max) {
    return min + Math.round(max * Math.random());
  }

  static getRandomBoolean() {
    return Math.random() > 0.5;
  }

  static getRandomArrayItem(array) {
    const index = this.getRandomNumber(0, array.length - 1);

    return array[index];
  }

  static castTimeFormat(value) {
    return value < 10 ? `0${value}` : String(value);
  }

  static getRandomDate() {
    const date = new Date();
    const sign = Math.random() > 0.5 ? 1 : -1;
    const diffDay = sign * this.getRandomNumber(0, 1);
    const diffHours = sign * this.getRandomNumber(0, 4);
    const diffMinutes = sign * this.getRandomNumber(0, 12);

    date.setDate(date.getDate() + diffDay);
    date.setHours(date.getHours() + diffHours);
    date.setMinutes(date.getMinutes() + diffMinutes);

    return date;
  }

  static formatDate(date, format) {
    let dateFormatted = ``;

    switch (format) {
      case `F`:
        dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() % 100} ${this.castTimeFormat(date.getHours())}:${this.castTimeFormat(date.getMinutes())}`;
        break;
      case `HM`:
        dateFormatted = `${this.castTimeFormat(date.getHours())}:${this.castTimeFormat(date.getMinutes())}`;
        break;
      case `DT`:
        dateFormatted = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${this.castTimeFormat(date.getHours())}:${this.castTimeFormat(date.getMinutes())}`;
        break;
      case `MD`: {
        dateFormatted = `${MONTHS.shorthands[date.getMonth()].toUpperCase()} ${date.getDate()}`;
        break;
      }
      default:
        dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() % 100} ${this.castTimeFormat(date.getHours())}:${this.castTimeFormat(date.getMinutes())}`;
    }

    return dateFormatted;
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static createElement(markup) {
    const element = document.createElement(`div`);
    element.innerHTML = markup;
    return element.firstChild;
  }

  static replaceElement(oldElement, newElement) {
    if (typeof oldElement.getElement === `function`) {
      oldElement = oldElement.getElement();
    }

    if (typeof newElement.getElement === `function`) {
      newElement = newElement.getElement();
    }

    oldElement.parentNode.replaceChild(newElement, oldElement);
  }
}
