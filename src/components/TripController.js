import RouteTrip from './route-trip';
import RouteDay from './route-day';
import Waypoint from './waypoint';
import WaypointEdit from './waypoint-edit';
import {render} from '../render';

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  renderWaypoints(waypoints) {
    const _RouteTrip = new RouteTrip(waypoints);

    render(this._container, _RouteTrip);

    const tripDayListBlock = this._container.querySelector(`.trip-days`);
    const dayList = _RouteTrip.fetchDayList();

    dayList.forEach((day) => {
      const _RouteDay = new RouteDay(day);

      render(tripDayListBlock, _RouteDay);

      const tripWaypointsBlock = tripDayListBlock.querySelector(`.trip-days__item:last-child .trip-events__list`);

      _RouteDay.waypoints.forEach((waypoint) => {
        const _Waypoint = new Waypoint(waypoint);
        const _WaypointEdit = new WaypointEdit(waypoint);

        _Waypoint.setOpenWaypointHandler(_Waypoint, _WaypointEdit);
        _WaypointEdit.setCloseWaypointHandlers(_Waypoint, _WaypointEdit);

        tripWaypointsBlock.appendChild(_Waypoint.getElement());
      });
    });
  }
}
