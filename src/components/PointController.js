import {KEYCODES} from '../const';

import Waypoint from './waypoint';
import WaypointEdit from './waypoint-edit';
import Utils from '../utils';

export default class PointController {
  constructor(container) {
    this._container = container;
    this._closeWaypointEditEscHandler = null;
  }

  _openWaypointEditHandler() {
    const waypointElement = this._Waypoint.getElement();
    const waypointEditElement = this._WaypointEdit.getElement();

    // close open waypoint edit form
    if (document.querySelector(`.event--edit`)) {
      document.dispatchEvent(
          new KeyboardEvent(
              `keydown`,
              {
                keyCode: KEYCODES.ESC
              }
          )
      );
    }

    Utils.replaceElement(waypointElement, waypointEditElement);

    this._closeWaypointEditEscHandler = (evt) => {
      if (evt.keyCode === KEYCODES.ESC || evt.which === KEYCODES.ESC) {
        Utils.replaceElement(waypointEditElement, waypointElement);
      }

      document.removeEventListener(`keydown`, this._closeWaypointEditEscHandler);
    };

    document.addEventListener(`keydown`, this._closeWaypointEditEscHandler);
  }

  _closeWaypointEditHandler() {
    const waypointElement = this._Waypoint.getElement();
    const waypointEditElement = this._WaypointEdit.getElement();

    Utils.replaceElement(waypointEditElement, waypointElement);

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

    this._container.appendChild(this._Waypoint.getElement());
  }
}
