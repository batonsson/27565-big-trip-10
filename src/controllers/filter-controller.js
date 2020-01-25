import Filters from '../components/filters';
import {FilterType} from '../utils/const';
import {render} from '../utils/render';

const filterOptions = [
  {
    value: `everything`,
    type: `radio`,
    isActive: true
  },
  {
    value: `future`,
    type: `radio`,
    isActive: false
  },
  {
    value: `past`,
    type: `radio`,
    isActive: false
  }
];

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
