import Utils from '../utils/utils';
import WaypointModel from '../models/waypoint';
import Waypoint from '../components/waypoint';
import WaypointEdit from '../components/waypoint-edit';
import {Keycode, DataHandleType, Mode} from '../utils/const';
import {remove} from '../utils/render';
import {debounce} from 'lodash';

export default class PointController {
  constructor(container, data, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._mode = null;

    this._data = data;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._closeWaypointEscHandler = null;
    this._openWaypointEditHandler = this._openWaypointEditHandler.bind(this);
    this._closeWaypointEditHandler = this._closeWaypointEditHandler.bind(this);
    this._closeWaypointAddHandler = this._closeWaypointAddHandler.bind(this);
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
    this._waypointEdit = new WaypointEdit(waypoint, this._data, this._mode === Mode.ADDING);

    if (this._mode === Mode.ADDING) {
      document.removeEventListener(`keydown`, this._closeWaypointEscHandler);

      this._waypointEdit.applyFlatpickr();
      this._waypointEdit.setSubmitWaypointHandler((evt) => {
        evt.preventDefault();
        waypoint.setData(this._waypointEdit.data);
        this._dataChangeHandler(this, waypoint, DataHandleType.ADD);
      });

      this._waypointEdit.setDeleteWaypointHandler(this._viewChangeHandler);

      this._closeWaypointEscHandler = (evt) => {
        if (evt.keyCode === Keycode.ESC || evt.which === Keycode.ESC) {
          this._closeWaypointAddHandler();
        }
      };

      document.addEventListener(`keydown`, this._closeWaypointEscHandler);
    }

    if (this._mode === Mode.DEFAULT) {
      this._waypoint = new Waypoint(waypoint);

      this._waypoint.setOpenWaypointEditHandler(() => {
        this._viewChangeHandler();
        this._openWaypointEditHandler();
      });

      this._waypointEdit.setCloseWaypointEditHandlers(this._viewChangeHandler);

      this._waypointEdit.setAddToFavoritesHandler(debounce(
          () => {
            waypoint.setData(this._waypointEdit.data);
            this._dataChangeHandler(this, waypoint, DataHandleType.SAVE);
          },
          150
      ));

      this._waypointEdit.setSubmitWaypointHandler((evt) => {
        evt.preventDefault();
        waypoint.setData(this._waypointEdit.data);
        this._dataChangeHandler(this, waypoint, DataHandleType.SAVE);
      });

      this._waypointEdit.setDeleteWaypointHandler(() => {
        this._dataChangeHandler(this, waypoint, DataHandleType.DELETE);
      });
    }

    const listItem = document.createElement(`li`);
    listItem.classList.add(`trip-events__item`);

    if (this._mode === Mode.DEFAULT) {
      listItem.appendChild(this._waypoint.getElement());
      this._container.appendChild(listItem);
    }

    if (this._mode === Mode.ADDING) {
      const tripEventsBlock = this._container.querySelector(`.trip-days`);
      this._container.insertBefore(this._waypointEdit.getElement(), tripEventsBlock);
    }
  }

  destroy() {
    if (this._mode === Mode.DEFAULT) {
      remove(this._waypoint);
    }

    remove(this._waypointEdit);
    document.removeEventListener(`keydown`, this._closeWaypointEscHandler);
  }

  _openWaypointEditHandler() {
    document.removeEventListener(`keydown`, this._closeWaypointEscHandler);
    Utils.replaceElement(this._waypoint.getElement(), this._waypointEdit.getElement());
    this._waypointEdit.applyFlatpickr();
    this._mode = Mode.EDIT;

    this._closeWaypointEscHandler = (evt) => {
      if (evt.keyCode === Keycode.ESC || evt.which === Keycode.ESC) {
        this._closeWaypointEditHandler();
      }
    };

    document.addEventListener(`keydown`, this._closeWaypointEscHandler);
  }

  _closeWaypointEditHandler() {
    this._waypointEdit.resetWaypoint();
    Utils.replaceElement(this._waypointEdit.getElement(), this._waypoint.getElement());
    this._mode = Mode.DEFAULT;

    document.removeEventListener(`keydown`, this._closeWaypointEscHandler);
  }

  _closeWaypointAddHandler() {
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    this.destroy();

    document.removeEventListener(`keydown`, this._closeWaypointEscHandler);
  }
}
