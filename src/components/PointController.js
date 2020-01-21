import {KEYCODES} from '../const';

import Waypoint from './waypoint';
import WaypointEdit from './waypoint-edit';
import Utils from '../utils';
import {remove} from '../render';
import {createWaypoint} from '../mocks/waypoint';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._mode = null;
    this._waypointDefault = createWaypoint();

    this._closeWaypointEditEscHandler = null;
    this._openWaypointEditHandler = this._openWaypointEditHandler.bind(this);
    this._closeWaypointEditHandler = this._closeWaypointEditHandler.bind(this);

    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
  }

  _openWaypointEditHandler() {
    document.removeEventListener(`keydown`, this._closeWaypointEditEscHandler);

    Utils.replaceElement(this._Waypoint.getElement(), this._WaypointEdit.getElement());
    this._WaypointEdit.applyFlatpickr();

    this._mode = Mode.EDIT;

    this._closeWaypointEditEscHandler = (evt) => {
      if (evt.keyCode === KEYCODES.ESC || evt.which === KEYCODES.ESC) {
        this._closeWaypointEditHandler();
      }
    };

    document.addEventListener(`keydown`, this._closeWaypointEditEscHandler);
  }

  _closeWaypointEditHandler() {
    this._WaypointEdit.resetWaypoint();

    Utils.replaceElement(this._WaypointEdit.getElement(), this._Waypoint.getElement());

    document.removeEventListener(`keydown`, this._closeWaypointEditEscHandler);

    this._mode = Mode.DEFAULT;
    this._closeWaypointEditEscHandler = null;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeWaypointEditHandler();
    }
  }

  render(waypoint, mode) {
    if (waypoint === null) {
      waypoint = this._waypointDefault;
    }

    this._mode = mode;
    this._WaypointEdit = new WaypointEdit(waypoint, this._mode === Mode.ADDING);

    this._WaypointEdit.setChangeEventTypeHandler((evt) => {
      const newWaypoint = Object.assign({}, waypoint);
      newWaypoint.type = evt.target.value;

      this._dataChangeHandler(this, waypoint, newWaypoint);
    });

    this._WaypointEdit.setChangeEventCityHandler((evt) => {
      const newWaypoint = Object.assign({}, waypoint);
      newWaypoint.city = evt.target.value;

      this._dataChangeHandler(this, waypoint, newWaypoint);
    });

    if (this._mode === Mode.ADDING) {
      const addWaypointButton = document.querySelector(`.trip-main__event-add-btn`);

      this._WaypointEdit.setSubmitWaypointHandler((evt) => {
        evt.preventDefault();

        const newWaypoint = this._WaypointEdit.data;

        this._dataChangeHandler(this, null, newWaypoint);

        this.destroy();
        addWaypointButton.disabled = false;
      });

      this._WaypointEdit.setDeleteWaypointHandler(() => {
        this.destroy();
        addWaypointButton.disabled = false;
      });
    }

    if (this._mode === Mode.DEFAULT) {
      this._Waypoint = new Waypoint(waypoint);

      this._Waypoint.setOpenWaypointEditHandler(() => {
        this._viewChangeHandler();
        this._openWaypointEditHandler();
      });

      this._WaypointEdit.setAddToFavoritesHandler(() => {
        const newWaypoint = Object.assign({}, waypoint);

        newWaypoint.isFavorite = !newWaypoint.isFavorite;

        this._dataChangeHandler(this, waypoint, newWaypoint);
      });

      this._WaypointEdit.setCloseWaypointEditHandlers(() => {
        this._viewChangeHandler();
      });

      this._WaypointEdit.setDeleteWaypointHandler(() => {
        this.destroy();
        this._dataChangeHandler(this, waypoint, null);
      });
    }

    const listItem = document.createElement(`li`);
    listItem.classList.add(`trip-events__item`);

    if (this._mode === Mode.DEFAULT) {
      listItem.appendChild(this._Waypoint.getElement());
      this._container.appendChild(listItem);
    }

    if (this._mode === Mode.ADDING) {
      const tripEventsBlock = this._container.querySelector(`.trip-days`);
      this._container.insertBefore(this._WaypointEdit.getElement(), tripEventsBlock);
    }
  }

  destroy() {
    if (this._mode === Mode.DEFAULT) {
      remove(this._Waypoint);
    }

    remove(this._WaypointEdit);
    document.removeEventListener(`keydown`, this._closeWaypointEditEscHandler);
  }
}
