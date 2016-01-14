import moment from 'moment-timezone';
import _ from 'lodash';

const TIME_FORMAT_KEY = 'timeFormat';
const TIME_ZONE_KEY = 'timeZone';
const FIRST_TIME_TIMEZONE_KEY = 'hasInitialTimezoneSet';

class DateTime {
    constructor($rootScope, $interval, $http, $localForage, $timeout, $uibModal) {
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
        this.guessedTimeZone = moment.tz.guess();
        this.timeZone = this.guessedTimeZone;
        this.refreshTimeFormats();

        // Set a promise to resolve on
        this.initialised = $localForage
            .getItem([TIME_FORMAT_KEY, TIME_ZONE_KEY, FIRST_TIME_TIMEZONE_KEY])
            .spread((format, zone, firstTime) => {
                _.mergeNotNull(this, {
                    timeFormat: format,
                    timeZone: zone
                });

                if (_.isNull(firstTime)) {
                    $localForage.setItem(FIRST_TIME_TIMEZONE_KEY, true);
                    this.timeZone = this.guessedTimeZone;

                    $uibModal.open({
                        size: 'sm',
                        template: `
<div class="modal-body">
    <p translate="DateTime.autoTimezone.message" translate-value-timezone="'${this.timeZone}'"></p>
    <button class="btn btn-block btn-success" ng-click="$close()" translate="DateTime.autoTimezone.close"></button>
</div>
                        `
                    });
                }

                $rootScope.$watch(() => this.timeFormat, () => {
                    $localForage.setItem(TIME_FORMAT_KEY, this.timeFormat);
                    this.refreshTimeFormats();
                    this.$rootScope.$broadcast('timeFormat');
                    ga('set', 'dimension2', this.timeFormat);
                });
                $rootScope.$watch(() => this.timeZone, () => {
                    $localForage.setItem(TIME_ZONE_KEY, this.timeZone);
                    this.refreshTimeFormats();
                    this.$rootScope.$broadcast('timeZone');
                    ga('set', 'dimension1', this.timeZone);
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
        this.$rootScope.$broadcast('tick');
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
                ga('set', 'metric1', this.offset);
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
DateTime.$inject = ['$rootScope', '$interval', '$http', '$localForage', '$timeout', '$uibModal'];

export default DateTime;
