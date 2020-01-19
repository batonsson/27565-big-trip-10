import {KEYCODES} from '../const';

import Waypoint from './waypoint';
import WaypointEdit from './waypoint-edit';
import Utils from '../utils';
import {remove} from '../render';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._mode = null;

    this._closeWaypointEditEscHandler = null;
    this._openWaypointEditHandler = this._openWaypointEditHandler.bind(this);
    this._closeWaypointEditHandler = this._closeWaypointEditHandler.bind(this);

    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
  }

  _openWaypointEditHandler() {
    document.removeEventListener(`keydown`, this._closeWaypointEditEscHandler);

    Utils.replaceElement(this._Waypoint.getElement(), this._WaypointEdit.getElement());

    this._mode = Mode.EDIT;

    this._closeWaypointEditEscHandler = (evt) => {
      if (evt.keyCode === KEYCODES.ESC || evt.which === KEYCODES.ESC) {
        this._closeWaypointEditHandler();
      }
    };

    document.addEventListener(`keydown`, this._closeWaypointEditEscHandler);
  }

  _closeWaypointEditHandler() {
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
    this._Waypoint = new Waypoint(waypoint);
    this._WaypointEdit = new WaypointEdit(waypoint);

    this._mode = mode;

    this._Waypoint.setOpenWaypointEditHandler(() => {
      this._viewChangeHandler();
      this._openWaypointEditHandler();
    });

    this._WaypointEdit.setCloseWaypointEditHandlers(() => {
      this._viewChangeHandler();
    });

    this._WaypointEdit.setAddToFavoritesHandler(() => {
      const newWaypoint = Object.assign({}, waypoint);

      newWaypoint.isFavorite = !newWaypoint.isFavorite;

      this._dataChangeHandler(this, waypoint, newWaypoint);
    });

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

    this._container.appendChild(this._Waypoint.getElement());
  }

  destroy() {
    remove(this._Waypoint);
    remove(this._WaypointEdit);
    document.removeEventListener(`keydown`, this._closeWaypointEditEscHandler);
  }
}
