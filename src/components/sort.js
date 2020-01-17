import Utils from '../utils';
import AbstractComponent from './abstract-component';

const createSortOptionsMarkup = (options) => {
  let sortOptionsMarkup = ``;

  options.forEach((option) => {
    const {value, hasIcon, isActive} = option;

    sortOptionsMarkup += `<div class="trip-sort__item  trip-sort__item--${value}">
                            <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${value}" ${isActive ? `checked` : ``}>
                            <label class="trip-sort__btn" for="sort-${value}">
                              ${Utils.capitalizeFirstLetter(value)}
                              ${hasIcon ? `
                                <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                                  <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
                                </svg>` : ``}
                            </label>
                          </div>`;
  });

  return sortOptionsMarkup;
};

const createSortFormMarkup = (options) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      ${createSortOptionsMarkup(options)}

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor(options) {
    super();

    this._options = options;
    this._element = null;
  }

  getTemplate() {
    return createSortFormMarkup(this._options);
  }
}
