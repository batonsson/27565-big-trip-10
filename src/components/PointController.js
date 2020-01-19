import {KEYCODES} from '../const';

import Waypoint from './waypoint';
import WaypointEdit from './waypoint-edit';
import Utils from '../utils';
import {remove} from '../render';

export default class PointController {
  constructor(container, dataChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._closeWaypointEditEscHandler = null;

    this._openWaypointEditHandler = this._openWaypointEditHandler.bind(this);
    this._closeWaypointEditHandler = this._closeWaypointEditHandler.bind(this);
  }

  _openWaypointEditHandler() {
    document.removeEventListener(`keydown`, this._closeWaypointEditEscHandler);

    Utils.replaceElement(this._Waypoint, this._WaypointEdit);

    this._closeWaypointEditEscHandler = (evt) => {
      if (evt.keyCode === KEYCODES.ESC || evt.which === KEYCODES.ESC) {
        Utils.replaceElement(this._WaypointEdit, this._Waypoint);
      }

      document.removeEventListener(`keydown`, this._closeWaypointEditEscHandler);
    };

    document.addEventListener(`keydown`, this._closeWaypointEditEscHandler);
  }

  _closeWaypointEditHandler() {
    Utils.replaceElement(this._WaypointEdit, this._Waypoint);

    document.removeEventListener(`keydown`, this._closeWaypointEditEscHandler);

    this._closeWaypointEditEscHandler = null;
  }

  render(waypoint) {
    this._Waypoint = new Waypoint(waypoint);
    this._WaypointEdit = new WaypointEdit(waypoint);

    this._Waypoint.setOpenWaypointEditHandler(() => {
      this._openWaypointEditHandler();
    });

    this._WaypointEdit.setCloseWaypointEditHandlers(() => {
      this._closeWaypointEditHandler();
    });

    this._WaypointEdit.setAddToFavoritesHandler(() => {
      const newWaypoint = Object.assign({}, waypoint);

      newWaypoint.isFavorite = !newWaypoint.isFavorite;

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
