import {CHART_TYPES} from './const';
import moment from 'moment';

const getPossibleWaypoints = (waypoints, possibleTypes) => {
  return waypoints.filter((waypoint) => {
    return possibleTypes.includes(waypoint.type);
  });
};

const assembleData = (rawData) => {
  const data = {
    labels: [],
    values: []
  };

  for (const key in rawData) {
    if (key) {
      data.labels.push(key);
      data.values.push(rawData[key]);
    }
  }

  return data;
};

const fetchChartMoneyData = (_Waypoints) => {
  const data = {};
  const targetWaypoints = _Waypoints.getWaypoints();

  targetWaypoints.forEach((waypoint) => {
    const start = data[waypoint.type] ? data[waypoint.type] : 0;
    data[waypoint.type] = start + waypoint.price;
  });

  return data;
};

const fetchChartTransportData = (_Waypoints) => {
  const data = {};
  const possibleTypes = [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`];
  const targetWaypoints = getPossibleWaypoints(_Waypoints.getWaypoints(), possibleTypes);

  targetWaypoints.forEach((waypoint) => {
    const start = data[waypoint.type] ? data[waypoint.type] : 0;
    data[waypoint.type] = start + 1;
  });

  return data;
};

const fetchChartTimeData = (_Waypoints) => {
  const data = {};
  const targetWaypoints = _Waypoints.getWaypoints();

  targetWaypoints.forEach((waypoint) => {
    const start = data[waypoint.type] ? data[waypoint.type] : 0;
    data[waypoint.type] = start + Math.floor(moment.duration(waypoint.time.diff.raw).asHours());
  });

  return data;
};

export const fetchChartData = (_Waypoints, type) => {
  let data = {};

  switch (type) {
    case CHART_TYPES.MONEY:
      data = fetchChartMoneyData(_Waypoints);
      break;
    case CHART_TYPES.TRANSPORT:
      data = fetchChartTransportData(_Waypoints);
      break;
    case CHART_TYPES.TIME:
      data = fetchChartTimeData(_Waypoints);
      break;
  }

  return assembleData(data);
};
