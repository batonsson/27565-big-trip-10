import Utils from '../utils/utils';
import RouteDay from '../components/route-day';
import RouteInfo from '../components/route-info';
import RouteTrip from '../components/route-trip';
import Sort from '../components/sort';
import PointController, {Mode as PointControllerMode} from './point-controller';
import {DataHandleType} from '../utils/const';
import {render} from '../utils/render';

const sortOptions = [
  {
    value: `event`,
    icon: false,
    isActive: true
  },
  {
    value: `time`,
    type: true,
    isActive: false
  },
  {
    value: `price`,
    type: true,
    isActive: false
  }
];


const ButtonState = {
  SAVE: {
    DEFAULT: `Save`,
    IN_PROGRESS: `Saving...`
  },
  DELETE: {
    DEFAULT: `Delete`,
    IN_PROGRESS: `Deleting...`
  },
};

const sortByTime = (next, prev) => {
  return prev.time.diff.raw - next.time.diff.raw;
};

const sortByPrice = (next, prev) => {
  return prev.price - next.price;
};

const sortWaypoints = (waypoints, sortType) => {
  if (sortType === `price`) {
    waypoints.sort(sortByPrice);
  }

  if (sortType === `time`) {
    waypoints.sort(sortByTime);
  }

  return waypoints;
};

const toggleFormActive = (form, isActive) => {
  for (const field of form.elements) {
    field.disabled = !isActive;
  }
};

const changeButtonState = (button, state) => {
  button.textContent = state;
};

const handleCatch = (button, buttonText, source) => {
  changeButtonState(button, buttonText);
  toggleFormError(source, true);
};

const toggleFormError = (form, isError) => {
  if (isError) {
    form.classList.add(`event--error`);
  } else {
    form.classList.remove(`event--error`);
  }
};

const handleSuccess = (ctx) => {
  ctx.renderWaypoints(ctx._Sort.activeSortType);
  ctx._RouteInfo.recalculate(ctx._Waypoints.getWaypoints());
};

export default class TripController {
  constructor(Waypoints, Data, API, container) {
    this._Waypoints = Waypoints;
    this._container = container;
    this._Sort = null;
    this._RouteInfo = null;
    this._RouteTrip = null;
    this._PointControllers = [];
    this._newPointControllers = null;

    this._Data = Data;
    this._API = API;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  _dataChangeHandler(_PointController, waypoint, type) {
    const source = _PointController._WaypointEdit.getElement();
    toggleFormActive(source, false);
    toggleFormError(source, false);
    let button = null;

    switch (type) {
      case DataHandleType.ADD:
        button = source.querySelector(`.event__save-btn`);
        changeButtonState(button, ButtonState.SAVE.IN_PROGRESS);

        this._API.addWaypoint(waypoint)
          .then((newWaypoint) => {
            _PointController._closeWaypointAddHandler();
            this._Waypoints.addWaypoint(newWaypoint);
            handleSuccess(this);
          })
          .catch(() => {
            handleCatch(button, ButtonState.SAVE.DEFAULT, source);
          })
          .finally(() => {
            toggleFormActive(source, true);
          });
        break;

      case DataHandleType.SAVE:
        button = source.querySelector(`.event__save-btn`);
        changeButtonState(button, ButtonState.SAVE.IN_PROGRESS);

        this._API.saveWaypoint(waypoint)
          .then((newWaypoint) => {
            this._Waypoints.updateWaypoint(newWaypoint);
            handleSuccess(this);
          })
          .catch(() => {
            handleCatch(button, ButtonState.SAVE.DEFAULT, source);
          })
          .finally(() => {
            toggleFormActive(source, true);
          });
        break;

      case DataHandleType.DELETE:
        button = source.querySelector(`.event__reset-btn`);
        changeButtonState(button, ButtonState.DELETE.IN_PROGRESS);

        this._API.deleteWaypoint(waypoint)
          .then(() => {
            _PointController.destroy();
            this._Waypoints.deleteWaypoint(waypoint.id);
            handleSuccess(this);
          })
          .catch(() => {
            handleCatch(button, ButtonState.DELETE.DEFAULT, source);
          })
          .finally(() => {
            toggleFormActive(source, true);
          });
        break;
    }
  }

  _sortClickHandler(sortType) {
    this.renderWaypoints(sortType);
  }

  _viewChangeHandler() {
    this._PointControllers.forEach((pointController) => {
      pointController.setDefaultView();
    });

    if (this._newPointController) {
      this._newPointController.setDefaultView();
    }
  }

  _filterChangeHandler() {
    this.renderWaypoints(this._Sort.activeSortType);
  }

  _toggleNoWaypointsMessage(show) {
    const noWaypointsMessageElement = document.querySelector(`.trip-events__msg`);

    if (noWaypointsMessageElement !== null) {
      noWaypointsMessageElement.remove();
    }

    if (show) {
      const noWaypointsMessageTemplate = `<p class="trip-events__msg">Click New Event to create your first point</p>`;
      render(this._container, Utils.createElement(noWaypointsMessageTemplate));
    }
  }

  set RouteTrip(_RouteTrip) {
    this._RouteTrip = _RouteTrip;
  }

  renderWaypoints(sortType) {
    this._PointControllers = [];
    const waypoints = this._Waypoints.getWaypoints();
    const tripDayListBlock = this._container.querySelector(`.trip-days`);
    tripDayListBlock.innerHTML = ``;

    if (!waypoints.length) {
      this._toggleNoWaypointsMessage(true);
      return;
    } else {
      this._toggleNoWaypointsMessage(false);
    }

    let dayList;

    switch (sortType) {
      case `event`:
        dayList = this._RouteTrip.fetchDayList(waypoints);
        break;
      default:
        dayList = [
          {
            date: null,
            waypoints: sortWaypoints(waypoints, sortType),
            index: null
          }
        ];
    }

    dayList.forEach((day) => {
      const _RouteDay = new RouteDay(day);
      render(tripDayListBlock, _RouteDay);
      const tripWaypointsBlock = tripDayListBlock.querySelector(`.trip-days__item:last-child .trip-events__list`);

      _RouteDay.waypoints.forEach((waypoint) => {
        const _PointController = new PointController(tripWaypointsBlock, this._Data, this._dataChangeHandler, this._viewChangeHandler);
        this._PointControllers.push(_PointController);
        _PointController.render(waypoint, PointControllerMode.DEFAULT);
      });
    });
  }

  init() {
    this._RouteInfo = new RouteInfo(this._Waypoints.getWaypoints());
    const tripRouteInfoBlock = document.querySelector(`.trip-main__trip-info`);
    const tripCost = tripRouteInfoBlock.querySelector(`.trip-info__cost`);
    render(tripRouteInfoBlock, this._RouteInfo, tripCost);

    this._Sort = new Sort(sortOptions);
    this._RouteTrip = new RouteTrip(this._Waypoints.getWaypoints());
    render(this._container, this._Sort);
    render(this._container, this._RouteTrip);

    this._Waypoints.filterChangeHandler(this._filterChangeHandler);

    const sortButtons = document.querySelectorAll(`.trip-sort__btn`);

    sortButtons.forEach((sortButton) => {
      this._Sort.setSortClickHandler(sortButton, this._sortClickHandler);
    });

    const addWaypointButton = document.querySelector(`.trip-main__event-add-btn`);

    addWaypointButton.addEventListener(`click`, (evt) => {
      if (!this._newPointController) {
        this._newPointController = new PointController(this._container, this._Data, this._dataChangeHandler, this._viewChangeHandler);
      }

      this._viewChangeHandler();
      evt.target.disabled = true;
      this._newPointController.render(null, PointControllerMode.ADDING);
    });

    this.renderWaypoints(this._Sort.activeSortType);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }
}
