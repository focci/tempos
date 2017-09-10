const config = require('../config');

class Caches {
    constructor() {
        this._data = Object.create(null);
    }
    get(key) {
        return config.cache ? this._data[key] : null;
    }

    set(key, val) {
        if( config.cache ) {
            this._data[key] = val;
        }
    }

    detail(key, callback) {
        let self = this, ret;
        if( !(ret = self.get(key)) ) {
            self.set(key, ret = callback());
        }
        return ret;
    }
}

module.exports = Caches;