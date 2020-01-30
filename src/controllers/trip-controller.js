import Utils from '../utils/utils';
import RouteDay from '../components/route-day';
import RouteInfo from '../components/route-info';
import RouteTrip from '../components/route-trip';
import Sort from '../components/sort';
import PointController from './point-controller';
import {DataHandleType, Mode as PointControllerMode} from '../utils/const';
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
  ctx.renderWaypoints(ctx._sort.activeSortType);
  ctx._routeInfo.recalculate(ctx._waypointsModel.getWaypoints());
};

export default class TripController {
  constructor(waypointsModel, routeData, api, container) {
    this._waypointsModel = waypointsModel;
    this._container = container;
    this._sort = null;
    this._routeInfo = null;
    this._routeTrip = null;
    this._pointControllers = [];
    this._newPointControllers = null;

    this._routeData = routeData;
    this._api = api;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortClickHandler = this._sortClickHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  set RouteTrip(_routeTrip) {
    this._routeTrip = _routeTrip;
  }

  renderWaypoints(sortType) {
    this._pointControllers = [];
    const waypoints = this._waypointsModel.getWaypoints();
    const tripDayListBlock = this._container.querySelector(`.trip-days`);
    tripDayListBlock.innerHTML = ``;

    if (!waypoints.length) {
      this._toggleNoWaypointsMessage(true);
      return;
    }

    this._toggleNoWaypointsMessage(false);
    let days;

    switch (sortType) {
      case `event`:
        days = this._routeTrip.fetchDayList(waypoints);
        break;
      default:
        days = [
          {
            date: null,
            waypoints: sortWaypoints(waypoints, sortType),
            index: null
          }
        ];
    }

    days.forEach((day) => {
      const routeDay = new RouteDay(day);
      render(tripDayListBlock, routeDay);
      const tripWaypointsBlock = tripDayListBlock.querySelector(`.trip-days__item:last-child .trip-events__list`);

      routeDay.waypoints.forEach((waypoint) => {
        const pointController = new PointController(tripWaypointsBlock, this._routeData, this._dataChangeHandler, this._viewChangeHandler);
        this._pointControllers.push(pointController);
        pointController.render(waypoint, PointControllerMode.DEFAULT);
      });
    });
  }

  init() {
    this._routeInfo = new RouteInfo(this._waypointsModel.getWaypoints());
    const tripRouteInfoBlock = document.querySelector(`.trip-main__trip-info`);
    const tripCost = tripRouteInfoBlock.querySelector(`.trip-info__cost`);
    render(tripRouteInfoBlock, this._routeInfo, tripCost);

    this._sort = new Sort(sortOptions);
    this._routeTrip = new RouteTrip();
    render(this._container, this._sort);
    render(this._container, this._routeTrip);

    this._waypointsModel.filterChangeHandler(this._filterChangeHandler);

    const sortButtons = document.querySelectorAll(`.trip-sort__btn`);

    sortButtons.forEach((sortButton) => {
      this._sort.setSortClickHandler(sortButton, this._sortClickHandler);
    });

    const addWaypointButton = document.querySelector(`.trip-main__event-add-btn`);

    addWaypointButton.addEventListener(`click`, (evt) => {
      if (!this._newPointController) {
        this._newPointController = new PointController(this._container, this._routeData, this._dataChangeHandler, this._viewChangeHandler);
      }

      this._viewChangeHandler();
      evt.target.disabled = true;
      this._newPointController.render(null, PointControllerMode.ADDING);
    });

    this.renderWaypoints(this._sort.activeSortType);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  _dataChangeHandler(pointController, waypoint, type) {
    const source = pointController._waypointEdit.getElement();
    toggleFormActive(source, false);
    toggleFormError(source, false);
    let button = null;

    switch (type) {
      case DataHandleType.ADD:
        button = source.querySelector(`.event__save-btn`);
        changeButtonState(button, ButtonState.SAVE.IN_PROGRESS);

        this._api.addWaypoint(waypoint)
          .then((newWaypoint) => {
            pointController._closeWaypointAddHandler();
            this._waypointsModel.addWaypoint(newWaypoint);
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

        this._api.saveWaypoint(waypoint)
          .then((newWaypoint) => {
            this._waypointsModel.updateWaypoint(newWaypoint);
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

        this._api.deleteWaypoint(waypoint)
          .then(() => {
            pointController.destroy();
            this._waypointsModel.deleteWaypoint(waypoint.id);
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
    this._pointControllers.forEach((pointController) => {
      pointController.setDefaultView();
    });

    if (this._newPointController) {
      this._newPointController.setDefaultView();
    }
  }

  _filterChangeHandler() {
    this.renderWaypoints(this._sort.activeSortType);
  }

  _toggleNoWaypointsMessage(show) {
    const noWaypointsMessageElement = document.querySelector(`.trip-events__msg`);

    if (noWaypointsMessageElement) {
      noWaypointsMessageElement.remove();
    }

    if (show) {
      const noWaypointsMessageTemplate = `<p class="trip-events__msg">Click New Event to create your first point</p>`;
      render(this._container, Utils.createElement(noWaypointsMessageTemplate));
    }
  }
}
