import {Utils} from '../utils';

export class Menu {
  constructor(menuList) {
    this._menuList = menuList;
  }

  _createMenuElementMarkup(element) {
    const {value, isActive} = element;

    return (
      `<a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${value}</a>`
    );
  }

  getTemplate() {
    let menuListMarkup = ``;

    this._menuList.forEach((menuListElement) => {
      menuListMarkup += this._createMenuElementMarkup(menuListElement);
    });

    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
        ${menuListMarkup}
      </nav>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
