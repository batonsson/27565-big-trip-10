import moment from 'moment';
import {ChartType} from './const';

const getPossibleWaypoints = (waypoints, possibleTypes) => {
  return waypoints.filter((waypoint) => {
    return possibleTypes.includes(waypoint.type);
  });
};

const assembleData = (rawData) => {
  const data = {
    label: ``,
    labels: [],
    values: []
  };

  for (const key in rawData.data) {
    if (key) {
      data.labels.push(key);
      data.values.push(rawData.data[key]);
    }
  }

  data.label = rawData.label;

  return data;
};

const fetchChartMoneyData = (_Waypoints) => {
  const data = {};
  const label = `MONEY`;
  const targetWaypoints = _Waypoints.getWaypoints();

  targetWaypoints.forEach((waypoint) => {
    const start = data[waypoint.type] ? data[waypoint.type] : 0;
    data[waypoint.type] = start + waypoint.price;
  });

  return {data, label};
};

const fetchChartTransportData = (_Waypoints) => {
  const data = {};
  const label = `TRANSPORT`;
  const possibleTypes = [`bus`, `drive`, `flight`, `ship`, `taxi`, `train`];
  const targetWaypoints = getPossibleWaypoints(_Waypoints.getWaypoints(), possibleTypes);

  targetWaypoints.forEach((waypoint) => {
    const start = data[waypoint.type] ? data[waypoint.type] : 0;
    data[waypoint.type] = start + 1;
  });

  return {data, label};
};

const fetchChartTimeData = (_Waypoints) => {
  const data = {};
  const label = `TIME`;
  const targetWaypoints = _Waypoints.getWaypoints();

  targetWaypoints.forEach((waypoint) => {
    const start = data[waypoint.type] ? data[waypoint.type] : 0;
    data[waypoint.type] = start + Math.floor(moment.duration(waypoint.time.diff.raw).asHours());
  });

  return {data, label};
};

export const fetchChartData = (_Waypoints, type) => {
  let data = {};

  switch (type) {
    case ChartType.MONEY:
      data = fetchChartMoneyData(_Waypoints);
      break;
    case ChartType.TRANSPORT:
      data = fetchChartTransportData(_Waypoints);
      break;
    case ChartType.TIME:
      data = fetchChartTimeData(_Waypoints);
      break;
  }

  return assembleData(data);
};
