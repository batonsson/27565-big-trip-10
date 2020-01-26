import Filters from '../components/filters';
import {FilterType} from '../utils/const';
import {render} from '../utils/render';

const FilterOption = {
  EVERYTHING: {
    value: `everything`,
    type: `radio`,
    isActive: true,
    isDisabled: false
  },
  FUTURE: {
    value: `future`,
    type: `radio`,
    isActive: false,
    isDisabled: false
  },
  PAST: {
    value: `past`,
    type: `radio`,
    isActive: false,
    isDisabled: false
  }
};

const checkEnabledFilters = (filters, waypoints) => {
  const filterOptions = [];

  for (const filter in FilterOption) {
    if (filter) {
      FilterOption[filter].isDisabled = !waypoints.getWaypoints(FilterType[filter]).length;
      filterOptions.push(FilterOption[filter]);
    }
  }

  return filterOptions;
};

export default class FilterController {
  constructor(Waypoints, container) {
    this._Waypoints = Waypoints;
    this._container = container;
    this._activeFilterType = FilterType.EVERYTHING;
    this._Filters = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._filterAvailabilityHandler = this._filterAvailabilityHandler.bind(this);
  }

  render() {
    const filterOptions = checkEnabledFilters(FilterOption, this._Waypoints);
    this._Filters = new Filters(filterOptions);

    this._Filters.setFilterChangeHandler((evt) => {
      this._filterChangeHandler(evt.target.value);
    });

    this._Waypoints.filterAvailabilityHandler(this._filterAvailabilityHandler);

    render(this._container, this._Filters);
  }

  _filterChangeHandler(filterType) {
    this._Waypoints.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _filterAvailabilityHandler() {
    const filters = this._Filters.getElement().querySelectorAll(`.trip-filters__filter-input`);

    filters.forEach((filter) => {
      filter.disabled = !this._Waypoints.getWaypoints(filter.value).length;

      if (filter.checked && filter.disabled) {
        this._Waypoints.setFilter(FilterType.EVERYTHING);
        this._Filters.getElement().querySelector(`#filter-everything`).checked = true;
      }
    });
  }
}
