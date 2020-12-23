export default class Store {
  constructor() {
    this._offers = [];
    this._destinations = [];
  }

  setOffers(offers) {
    this._offers = [...offers];
  }

  setDestinations(destinations) {
    this._destinations = [...destinations];
  }

  getOffers() {
    return this._offers;
  }

  getDestinations() {
    return this._destinations;
  }
}
