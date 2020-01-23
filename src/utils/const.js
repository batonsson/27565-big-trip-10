export const KEYCODES = {
  ESC: 27
};

export const MONTHS = {
  longhands: [
    `January`,
    `February`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`
  ],
  shorthands: [
    `Jan`,
    `Feb`,
    `Mar`,
    `Apr`,
    `May`,
    `Jun`,
    `Jul`,
    `Aug`,
    `Sep`,
    `Oct`,
    `Nov`,
    `Dec`
  ]
};

export const TYPES = [
  {
    value: `bus`,
    group: `transfer`
  },
  {
    value: `check-in`,
    group: `activity`
  },
  {
    value: `drive`,
    group: `transfer`
  },
  {
    value: `flight`,
    group: `transfer`
  },
  {
    value: `restaurant`,
    group: `activity`
  },
  {
    value: `ship`,
    group: `transfer`
  },
  {
    value: `sightseeing`,
    group: `activity`
  },
  {
    value: `taxi`,
    group: `transfer`
  },
  {
    value: `train`,
    group: `transfer`
  },
  {
    value: `transport`,
    group: `transfer`
  }
];

export const CITIES = [
  `Kaliningrad`,
  `London`,
  `Protaras`,
  `Valetta`,
  `Strasbourg`,
  `Amsterdam`
];

export const OFFERS = [
  {
    type: `Add luggage`,
    price: 20
  },
  {
    type: `Switch to comfort class`,
    price: 40
  },
  {
    type: `Add meal`,
    price: 10
  },
  {
    type: `Choose seats`,
    price: 10
  },
  {
    type: `Travel by train`,
    price: 40
  }
];

export const FILTER_TYPE = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MENU_ITEMS = {
  TABLE: `table`,
  STATS: `stats`,
};

export const CHART_TYPES = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME: `time`
};
