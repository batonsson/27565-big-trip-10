import {Utils} from '../utils';

export class Filters {
  constructor(filterList) {
    this._filterList = filterList;
  }

  _createFilterMarkup(filter) {
    const {value, type, isActive} = filter;

    return (
      `<div class="trip-filters__filter">
        <input id="filter-${value}" class="trip-filters__filter-input  visually-hidden" type="${type}" name="trip-filter" value="${value}" ${isActive ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${value}">${Utils.capitalizeFirstLetter(value)}</label>
      </div>`
    );
  }

  getTemplate() {
    let filterListMarkup = ``;

    this._filterList.forEach((element) => {
      filterListMarkup += this._createFilterMarkup(element);
    });

    return (
      `<form class="trip-filters" action="#" method="get">
        ${filterListMarkup}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
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
