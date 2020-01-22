import AbstractComponent from './abstract-component';
import {MENU_ITEMS} from '../utils/const';
import Utils from '../utils/utils.js';

const ACTIVE_CLASS = `trip-tabs__btn--active`;

const createMenuListMarkup = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn" href="#" data-menu-item="${MENU_ITEMS.TABLE}">${Utils.capitalizeFirstLetter(MENU_ITEMS.TABLE)}</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MENU_ITEMS.STATS}">${Utils.capitalizeFirstLetter(MENU_ITEMS.STATS)}</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  constructor() {
    super();

    this._activeItem = null;
  }

  get activeItem() {
    return this._activeItem;
  }

  getTemplate() {
    return createMenuListMarkup();
  }

  setMenuClickHandler(menuClickHandler) {
    const menuItems = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    menuItems.forEach((item) => {
      item.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        menuClickHandler(evt.target.dataset.menuItem);
      });
    });
  }

  setMenuItemActive(menuItem) {
    const targetItem = this.getElement().querySelector(`[data-menu-item="${menuItem}"]`);

    if (targetItem.classList.contains(ACTIVE_CLASS)) {
      return;
    }

    const menuItems = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    menuItems.forEach((item) => {
      item.classList.remove(`trip-tabs__btn--active`);
    });

    targetItem.classList.add(ACTIVE_CLASS);
    this._activeItem = targetItem.dataset.menuItem;
  }
}
