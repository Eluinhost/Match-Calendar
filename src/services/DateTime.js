import moment from 'moment-timezone';
import _ from 'lodash';

const TIME_FORMAT_KEY = 'timeFormat';
const TIME_ZONE_KEY = 'timeZone';

class DateTime {
    constructor($rootScope, $interval, $http, $localForage, $timeout) {
        this.$rootScope = $rootScope;
        this.$http = $http;

        // URL path for syncing time
        this.resyncURL = 'api/sync';

        // Preset values for chosing zone/format
        this.timeFormats = ['12h', '24h'];
        this.timeZones = moment.tz.names();

        // Whether we have synced with the server at least once or not
        this.synced = false;

        // The ms offset from the server
        this.offset = 0;

        // Sync/resync in progress?
        this.syncing = false;

        this.formats = {
            REDDIT_POST: 'MMM DD HH:mm z' // Doesn't get modified by time format
        };

        // Default values
        this.timeFormat = '24h';
        this.timeZone = 'Etc/UTC';

        // Set a promise to resolve on
        this.initialised = $localForage
            .getItem([TIME_FORMAT_KEY, TIME_ZONE_KEY])
            .spread((format, zone) => {
                if (!_.isUndefined(format)) {
                    this.timeFormat = format;
                }

                if (!_.isUndefined(zone)) {
                    this.timeZone = zone;
                }

                $rootScope.$watch(() => this.timeFormat, () => {
                    $localForage.setItem(TIME_FORMAT_KEY, this.timeFormat);
                    this.refreshTimeFormats();
                });
                $rootScope.$watch(() => this.timeZone, () => {
                    $localForage.setItem(TIME_ZONE_KEY, this.timeZone);
                    this.refreshTimeFormats();
                });
            });

        // Start clock, no dirty check
        $interval(() => this.tick(), 1000, false);

        // Resync every hour
        $interval(() => this.resync(), 1000 * 60 * 60, false);

        // Start initial sync
        this.resync();

        // Start another after 10 seconds once the page has settled down a little bit
        $timeout(() => this.resync(), 10000);
    }

    /**
     * Sends out the clock tick event
     */
    tick() {
        this.$rootScope.$broadcast('clockTick');
    }

    /**
     * @returns {moment} current time with offset applied
     */
    getTime() {
        let current = moment();
        current.add(this.offset, 'ms');
        return current;
    }

    /**
     * Refreshes the values in this.formats to match the timeFormat
     */
    refreshTimeFormats() {
        if (this.timeFormat === '24h') {
            this.formats.TITLE = 'HH:mm';
            this.formats.HEADER = 'HH:mm:ss';
            this.formats.POST_HEADER = 'MMM DD - HH:mm';
        } else {
            this.formats.TITLE = 'hh:mm a';
            this.formats.HEADER = 'hh:mm:ss a';
            this.formats.POST_HEADER = 'MMM DD - hh:mm a';
        }
    }

    /**
     * @returns {Promise} that resolves when sync completed
     */
    resync() {
        this.syncing = true;
        return this.$http.get(this.resyncURL)
            .then((data) => {
                this.synced = true;
                this.offset = data.data.time - moment().valueOf();
            })
            .catch(() => this.synced = false)
            .finally(() => this.syncing = false);
    }

    /**
     * Format the time with the given format type respecting the 12h/24h settings
     *
     * @param {string|Function} formatting - If type is string, uses the relevant formatting from this.formats.
     *                                   If type is Function the return string of the function will be used instead.
     * @param {moment} [time] - the time to be formatted
     * @param {boolean} [keeptz] - whether to modify the timezone to the settings timezone or keep original
     * @returns {string}
     */
    format(formatting, time = this.getTime(), keeptz = false) {
        if (!keeptz) {
            time.tz(this.timeZone);
        }

        return time.format(_.isFunction(formatting) ? formatting() : this.formats[formatting]);
    }
}
DateTime.$inject = ['$rootScope', '$interval', '$http', '$localForage', '$timeout'];

export default DateTime;