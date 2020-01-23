export default class Data {
  constructor() {
    this._destinations = [];
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinations() {
    return this._destinations;
  }

  getOffersByType(type) {
    return this._offers.filter((offer) => {
      return offer.type === type;
    })[0].offers;
  }

  getDestinationByCity(city) {
    const destination = this._destinations.filter((dest) => dest.name === city);

    return destination.length ? destination[0] : `Sorry to say we're not going there, pal.`;
  }
}
