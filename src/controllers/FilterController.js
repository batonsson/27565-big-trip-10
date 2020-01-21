import {filterOptions} from '../mocks/filters';

import Filters from '../components/filters';

import {render} from '../render';
import {FilterType} from '../const';

export default class FilterController {
  constructor(Waypoints, container) {
    this._Waypoints = Waypoints;
    this._container = container;

    this._activeFilterType = FilterType.EVERYTHING;
    this._Filters = null;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  _filterChangeHandler(filterType) {
    this._Waypoints.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  render() {
    this._Filters = new Filters(filterOptions);
    this._Filters.setFilterChangeHandler((evt) => {
      this._filterChangeHandler(evt.target.value);
    });

    render(this._container, this._Filters);
  }
}
