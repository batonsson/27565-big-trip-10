export default class Data {
  constructor() {
    this._destinations = [];
    this._offers = {};
  }

  setOffers(offers) {
    for (const [, entry] of Object.entries(offers)) {
      this._offers[entry.type] = entry.offers;
    }
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }

  get offers() {
    return this._offers;
  }

  getOffersByType(type) {
    return this._offers[type] || [];
  }

  getDestinationByCity(city) {
    const destination = this._destinations.filter((dest) => dest.name === city);

    return destination.length ? destination[0] : `Sorry to say we're not going there, pal.`;
  }
}
