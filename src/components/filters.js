import Utils from '../utils';
import AbstractComponent from './abstract-component';

const createFilterMarkup = (filter) => {
  const {value, type, isActive} = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${value}" class="trip-filters__filter-input  visually-hidden" type="${type}" name="trip-filter" value="${value}" ${isActive ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${value}">${Utils.capitalizeFirstLetter(value)}</label>
    </div>`
  );
};

const createFilterListMarkup = (filterList) => {
  let filterListMarkup = ``;

  filterList.forEach((element) => {
    filterListMarkup += createFilterMarkup(element);
  });

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterListMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractComponent {
  constructor(filterList) {
    super();

    this._filterList = filterList;
    this._element = null;
  }

  getTemplate() {
    return (createFilterListMarkup(this._filterList));
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
