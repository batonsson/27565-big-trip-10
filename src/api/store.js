import {StoreData} from '../utils/const';

export default class Store {
  constructor(key, storage) {
    this._key = key;
    this._storage = storage;

    this._initStore();
  }

  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._key));
    } catch (err) {
      return {};
    }
  }

  getByType(type) {
    try {
      const store = this.getAll();

      return store[type] || store;
    } catch (err) {
      return {};
    }
  }

  setItem(key, value, type) {
    const store = this.getAll();

    if (type) {
      Object.assign(store[type], key ? {[key]: value} : value);
    } else {
      Object.assign(key ? store : store[type], key ? {[key]: value} : value);
    }

    this._storage.setItem(
        this._key,
        JSON.stringify(store)
    );
  }

  removeItem(key, type = StoreData.WAYPOINTS) {
    const store = this.getAll();

    delete store[type][key];

    this._storage.setItem(
        this._key,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }

  _initStore() {
    const store = this.getAll();
    const structure = {};

    if (!store) {
      for (const key in StoreData) {
        if (key) {
          structure[StoreData[key]] = {};
        }
      }
    }

    this._storage.setItem(
        this._key,
        JSON.stringify(
            Object.assign({}, store, structure)
        )
    );
  }
}
