import AbstractComponent from './abstract-component';
import Utils from '../utils/utils';

const createFilterMarkup = (filter) => {
  const {value, type, isActive, isDisabled} = filter;

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${value}" class="trip-filters__filter-input  visually-hidden" type="${type}" name="trip-filter" value="${value}" ${isActive ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
      <label class="trip-filters__filter-label" for="filter-${value}">${Utils.capitalizeFirstLetter(value)}</label>
    </div>`
  );
};

const createFilterListMarkup = (filterList) => {
  const filterListMarkup = filterList.reduce((html, element) => html + createFilterMarkup(element), ``);

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
  }

  setFilterChangeHandler(filterChangeHandler) {
    this.getElement().addEventListener(`change`, filterChangeHandler);
  }

  getTemplate() {
    return (createFilterListMarkup(this._filterList));
  }
}
