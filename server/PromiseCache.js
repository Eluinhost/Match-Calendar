'use strict';

const moment = require('moment');
const _ = require('lodash');
const Promise = require('bluebird');

module.exports = class PromiseCache {
    /**
     * @param {Function} builder a function used to create values for keys. Called with the name of the key to build a
     * value for. Should return a promise, if a regular value is passed it will be wrapped in a successful promise.
     * @param {Number} timeout the amount of milliseconds to keep successful promises for
     * @param {Number} [failTimeout=timeout] the amount of milliseconds to keep failed promises for
     */
    constructor(builder, timeout, failTimeout = timeout) {
        this._cache = new Map();
        this._builder = builder;
        this._timeout = timeout;
        this._failTimeout = failTimeout;
    }

    /**
     * Fetches an item for the given key
     * @param key
     * @param {Function} [builder=this._builder] override the builder function used if no cached value found
     * @param {Number} [timeout=this._timeout] override the timeout on successful promises
     * @param {Number} [failTimeout=this._failTimeout] = override the timeout for failed promises
     * @returns {Promise} resolves to the cached value, can be a cached error
     */
    getItem(key, {builder = this._builder, timeout = this._timeout, failTimeout = this._failTimeout} = {}) {
        const now = moment();
        const existing = this._cache.get(key);

        if (!_.isUndefined(existing) && now.isBefore(existing.timeout)) {
            return existing.promise;
        }

        // Creates promise if required or use existing returned one
        const promise = Promise.resolve(builder(key));

        const cached = {
            promise,
            timeout: moment(now).add(timeout, 'ms')
        };

        this._cache.set(key, cached);

        // Recreate the timeout if the promise fails
        promise.catch(error => {
            cached.timeout = moment(now).add(failTimeout, 'ms');
            throw error;
        });

        return promise;
    }
};
