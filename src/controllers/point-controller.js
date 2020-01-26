import Utils from '../utils/utils';
import WaypointModel from '../models/waypoint';
import Waypoint from '../components/waypoint';
import WaypointEdit from '../components/waypoint-edit';
import {Keycode, DataHandleType} from '../utils/const';
import {remove} from '../utils/render';
import {debounce} from 'lodash';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, Data, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._mode = null;

    this._Data = Data;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._closeWaypointEscHandler = null;
    this._openWaypointEditHandler = this._openWaypointEditHandler.bind(this);
    this._closeWaypointEditHandler = this._closeWaypointEditHandler.bind(this);
    this._closeWaypointAddHandler = this._closeWaypointAddHandler.bind(this);
  }

  _openWaypointEditHandler() {
    document.removeEventListener(`keydown`, this._closeWaypointEscHandler);
    Utils.replaceElement(this._Waypoint.getElement(), this._WaypointEdit.getElement());
    this._WaypointEdit.applyFlatpickr();
    this._mode = Mode.EDIT;

    this._closeWaypointEscHandler = (evt) => {
      if (evt.keyCode === Keycode.ESC || evt.which === Keycode.ESC) {
        this._closeWaypointEditHandler();
      }
    };

    document.addEventListener(`keydown`, this._closeWaypointEscHandler);
  }

  _closeWaypointEditHandler() {
    this._WaypointEdit.resetWaypoint();
    Utils.replaceElement(this._WaypointEdit.getElement(), this._Waypoint.getElement());
    this._mode = Mode.DEFAULT;

    document.removeEventListener(`keydown`, this._closeWaypointEscHandler);
  }

  _closeWaypointAddHandler() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    this.destroy();

    document.removeEventListener(`keydown`, this._closeWaypointEscHandler);
  }

  setDefaultView() {
    if (this._mode === Mode.EDIT) {
      this._closeWaypointEditHandler();
    }

    if (this._mode === Mode.ADDING) {
      this._closeWaypointAddHandler();
    }
  }

  render(waypoint, mode) {
    if (waypoint === null) {
      waypoint = new WaypointModel(WaypointModel.getDefaultData());
    }

    this._mode = mode;
    this._WaypointEdit = new WaypointEdit(waypoint, this._Data, this._mode === Mode.ADDING);

    if (this._mode === Mode.ADDING) {
      document.removeEventListener(`keydown`, this._closeWaypointEscHandler);

      this._WaypointEdit.applyFlatpickr();
      this._WaypointEdit.setSubmitWaypointHandler((evt) => {
        evt.preventDefault();
        waypoint.setData(this._WaypointEdit.data);
        this._dataChangeHandler(this, waypoint, DataHandleType.ADD);
      });

      this._WaypointEdit.setDeleteWaypointHandler(this._viewChangeHandler);

      this._closeWaypointEscHandler = (evt) => {
        if (evt.keyCode === Keycode.ESC || evt.which === Keycode.ESC) {
          this._closeWaypointAddHandler();
        }
      };

      document.addEventListener(`keydown`, this._closeWaypointEscHandler);
    }

    if (this._mode === Mode.DEFAULT) {
      this._Waypoint = new Waypoint(waypoint);

      this._Waypoint.setOpenWaypointEditHandler(() => {
        this._viewChangeHandler();
        this._openWaypointEditHandler();
      });

      this._WaypointEdit.setCloseWaypointEditHandlers(this._viewChangeHandler);

      this._WaypointEdit.setAddToFavoritesHandler(debounce(
          () => {
            waypoint.setData(this._WaypointEdit.data);
            this._dataChangeHandler(this, waypoint, DataHandleType.SAVE);
          },
          150
      ));

      this._WaypointEdit.setSubmitWaypointHandler((evt) => {
        evt.preventDefault();
        waypoint.setData(this._WaypointEdit.data);
        this._dataChangeHandler(this, waypoint, DataHandleType.SAVE);
      });

      this._WaypointEdit.setDeleteWaypointHandler(() => {
        this._dataChangeHandler(this, waypoint, DataHandleType.DELETE);
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
    document.removeEventListener(`keydown`, this._closeWaypointEscHandler);
  }
}
