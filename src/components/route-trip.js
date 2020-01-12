import {createWaypoints} from './waypoint';

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

const fetchDayList = (waypoints) => {
  const dayList = [];

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
        waypoints: [waypoint]
      });
    }
  });

  return dayList;
};

const createRouteDayMarkup = (day, dayNumber) => {
  const {date, waypoints} = day;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayNumber}</span>
        <time class="day__date" datetime="2019-03-18">${date.formatted}</time>
      </div>

      <ul class="trip-events__list">
        ${createWaypoints(waypoints)}
      </ul>
    </li>`
  );
};

export const createRouteListMarkup = (waypoints) => {
  const dayList = fetchDayList(waypoints).sort((a, b) => {
    return a.date.raw > b.date.raw ? 1 : -1;
  });

  let dayListMarkup = ``;

  dayList.forEach((day, index) => {
    dayListMarkup += createRouteDayMarkup(day, index + 1);
  });

  return (
    `<ul class="trip-days">
      ${dayListMarkup}
    <ul>`
  );
};
