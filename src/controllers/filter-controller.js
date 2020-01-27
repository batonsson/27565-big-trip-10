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
  constructor(waypointsModel, container) {
    this._waypointsModel = waypointsModel;
    this._container = container;
    this._activeFilterType = FilterType.EVERYTHING;
    this._filters = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._filterAvailabilityHandler = this._filterAvailabilityHandler.bind(this);
  }

  render() {
    const filterOptions = checkEnabledFilters(FilterOption, this._waypointsModel);
    this._filters = new Filters(filterOptions);

    this._filters.setFilterChangeHandler((evt) => {
      this._filterChangeHandler(evt.target.value);
    });

    this._waypointsModel.filterAvailabilityHandler(this._filterAvailabilityHandler);

    render(this._container, this._filters);
  }

  _filterChangeHandler(filterType) {
    this._waypointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _filterAvailabilityHandler() {
    const filters = this._filters.getElement().querySelectorAll(`.trip-filters__filter-input`);

    filters.forEach((filter) => {
      filter.disabled = !this._waypointsModel.getWaypoints(filter.value).length;

      if (filter.checked && filter.disabled) {
        this._waypointsModel.setFilter(FilterType.EVERYTHING);
        this._filters.getElement().querySelector(`#filter-everything`).checked = true;
      }
    });
  }
}
