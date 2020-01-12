import {capitalizeFirstLetter} from '../utils';

const createFilterMarkup = (filter) => {
  const {value, type, isActive} = filter;

  return `<div class="trip-filters__filter">
            <input id="filter-${filter.value}" class="trip-filters__filter-input  visually-hidden" type="${type}" name="trip-filter" value="${value}" ${isActive ? `checked` : ``}>
            <label class="trip-filters__filter-label" for="filter-${value}">${capitalizeFirstLetter(value)}</label>
          </div>`;
};

export const createFiltersMarkup = (filters) => {
  let elements = ``;

  filters.forEach((element) => {
    elements += createFilterMarkup(element);
  });

  return (
    `<form class="trip-filters" action="#" method="get">
      ${elements}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};
