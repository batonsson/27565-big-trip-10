import AbstractComponent from './abstract-component';

const checkDayExists = (dayGiven, dayList) => {
  const check = {
    exists: false,
    index: null
  };

  check.exists = dayList.some((dayExisting, index) => {
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
    const dayList = [];
    waypoints = waypoints.sort((prev, next) => prev.time.start.raw - next.time.start.raw);

    waypoints.forEach((waypoint) => {
      const {exists, index} = checkDayExists(waypoint, dayList);

      if (exists) {
        dayList[index].waypoints.push(waypoint);
      } else {
        dayList.push({
          date: {
            raw: waypoint.time.start.raw,
            formatted: waypoint.time.start.MD
          },
          waypoints: [waypoint],
          index: dayList.length + 1
        });
      }
    });

    return dayList;
  }

  getTemplate() {
    return createRouteMarkup();
  }
}
