import moment from 'moment';

const getTimeDiff = (start, end) => {
  const dateFrom = moment.utc(start);
  const dateTo = moment.utc(end);

  const raw = dateTo - dateFrom;
  const days = moment.duration(dateTo.diff(dateFrom)).days();
  const hours = moment.duration(dateTo.diff(dateFrom)).hours();
  const minutes = moment.duration(dateTo.diff(dateFrom)).minutes();
  const formatted = `${days ? `${days}D` : `` } ${days || hours ? `${hours}H` : `` } ${minutes ? `${minutes}M` : `` }`.trim();

  return {
    raw,
    days,
    hours,
    minutes,
    formatted
  };
};

const getTime = (dateFrom, dateTo) => {
  let start = new Date(dateFrom);
  let end = new Date(dateTo);

  if (end < start) {
    [start, end] = [end, start];
  }

  return {
    start: {
      raw: start,
      F: moment(start).format(`DD/MM/YY HH:mm`),
      HM: moment(start).format(`HH:mm`),
      DT: `${moment(start).format(`YYYY-MM-DD`)}T${moment(start).format(`HH:mm`)}`,
      MD: moment(start).format(`MMM DD`)
    },
    end: {
      raw: end,
      F: moment(end).format(`DD/MM/YY HH:mm`),
      HM: moment(end).format(`HH:mm`),
      DT: `${moment(end).format(`YYYY-MM-DD`)}T${moment(end).format(`HH:mm`)}`,
      MD: moment(end).format(`MMM DD`)
    },
    diff: getTimeDiff(start, end)
  };
};

export default class Waypoint {
  constructor(waypoint) {
    this._id = waypoint.id;
    this._type = waypoint.type;
    this._time = getTime(waypoint.date_from, waypoint.date_to);
    this._price = waypoint.base_price;
    this._offers = waypoint.offers;
    this._destination = waypoint.destination;
    this._isFavorite = waypoint.is_favorite;
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get time() {
    return this._time;
  }

  get price() {
    return this._price;
  }

  get offers() {
    return this._offers;
  }

  get destination() {
    return this._destination;
  }

  get isFavorite() {
    return this._isFavorite;
  }

  toRaw() {
    return {
      'id': this.id,
      'type': this.type,
      'date_from': this.time.start.raw,
      'date_to': this.time.end.raw,
      'base_price': this.price,
      'offers': this.offers,
      'destination': this.destination,
      'is_favorite': this.isFavorite
    };
  }

  setData(data) {
    this._id = data.id;
    this._type = data.type;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
    this._destination = data.destination;
    this._isFavorite = data.isFavorite;
  }

  static getDefaultData() {
    const dateNow = (new Date()).toISOString();

    return {
      'id': null,
      'type': `bus`,
      'date_from': dateNow,
      'date_to': dateNow,
      'destination': {
        name: `Vien`,
        description: `Vien, with an embankment of a mighty river as a centre of attraction, a perfect place to stay with a family.`,
        pictures: [
          {
            src: `http://picsum.photos/300/200?r=0.6193744600657889`,
            description: `Vien street market`
          },
          {
            src: `http://picsum.photos/300/200?r=0.4154849146673443`,
            description: `Vien park`
          },
        ]
      },
      'base_price': 500,
      'isFavorite': false,
      'offers': [],
      'is_favorite': false
    };
  }

  static parseWaypoint(data) {
    return new Waypoint(data);
  }

  static parseWaypoints(data) {
    return data.map(Waypoint.parseWaypoint);
  }
}
