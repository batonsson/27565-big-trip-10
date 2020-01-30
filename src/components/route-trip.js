import AbstractComponent from './abstract-component';

const checkDayExists = (dayGiven, days) => {
  const check = {
    exists: false,
    index: null
  };

  check.exists = days.some((dayExisting, index) => {
    const exists = dayExisting.date.formatted === dayGiven.time.start.MD;

    if (exists) {
      check.index = index;
    }

    return exists;
  });

  return check;
};

const createRouteMarkup = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class RouteTrip extends AbstractComponent {
  constructor() {
    super();
  }

  fetchDayList(waypoints) {
    const days = [];
    waypoints = waypoints.sort((prev, next) => prev.time.start.raw - next.time.start.raw);

    waypoints.forEach((waypoint) => {
      const {exists, index} = checkDayExists(waypoint, days);

      if (exists) {
        days[index].waypoints.push(waypoint);
      } else {
        days.push({
          date: {
            raw: waypoint.time.start.raw,
            formatted: waypoint.time.start.MD
          },
          waypoints: [waypoint],
          index: days.length + 1
        });
      }
    });

    return days;
  }

  getTemplate() {
    return createRouteMarkup();
  }
}
