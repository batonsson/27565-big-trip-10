import Utils from '../utils';

const createMenuElementMarkup = (element) => {
  const {value, isActive} = element;

  return (
    `<a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${value}</a>`
  );
};

const createMenuListMarkup = (menuList) => {
  let menuListMarkup = ``;

  menuList.forEach((menuListElement) => {
    menuListMarkup += createMenuElementMarkup(menuListElement);
  });

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${menuListMarkup}
    </nav>`
  );
};

export default class Menu {
  constructor(menuList) {
    this._menuList = menuList;
    this._element = null;
  }

  getTemplate() {
    return createMenuListMarkup(this._menuList);
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
