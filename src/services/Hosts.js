import _ from 'lodash';

const FAVOURITE_HOST_KEY = 'favoriteHosts';
const BLOCKED_HOST_KEY = 'blockedHosts';
const FAVOURITE_EXTRA_KEY = 'favouriteExtras';
const BLOCKED_EXTRA_KEY = 'blockedExtras';

class Hosts {
    constructor($localForage, $rootScope) {
        this.favouriteHosts = [];
        this.blockedHosts = [];
        this.favouriteExtras = [];
        this.blockedExtras = [];

        // Set a promise to resolve on in routes
        this.initialised = $localForage
            .getItem([FAVOURITE_HOST_KEY, BLOCKED_HOST_KEY, FAVOURITE_EXTRA_KEY, BLOCKED_EXTRA_KEY])
            .spread((favouriteHosts, blockedHosts, favouriteExtras, blockedExtras) => {
                _.mergeNotNull(this, {
                    favouriteHosts,
                    blockedHosts,
                    favouriteExtras,
                    blockedExtras
                });

                $rootScope.$watchCollection(
                    () => this.favouriteHosts,
                    () => {
                        // Always make sure to store as lowercase
                        this.favouriteHosts = this.favouriteHosts.map(item => item.toLowerCase());
                        $localForage.setItem(FAVOURITE_HOST_KEY, this.favouriteHosts);
                        ga('set', 'metric2', this.favouriteHosts.length);
                    }
                );

                $rootScope.$watchCollection(
                    () => this.blockedHosts,
                    () => {
                        // Always make sure to store as lowercase
                        this.blockedHosts = this.blockedHosts.map(item => item.toLowerCase());
                        $localForage.setItem(BLOCKED_HOST_KEY, this.blockedHosts);
                        ga('set', 'metric3', this.blockedHosts.length);
                    }
                );

                $rootScope.$watchCollection(
                    () => this.favouriteExtras,
                    () => {
                        // Always make sure to store as lowercase
                        this.favouriteExtras = this.favouriteExtras.map(item => item.toLowerCase());
                        $localForage.setItem(FAVOURITE_EXTRA_KEY, this.favouriteExtras);
                    }
                );

                $rootScope.$watchCollection(
                    () => this.blockedExtras,
                    () => {
                        // Always make sure to store as lowercase
                        this.blockedExtras = this.blockedExtras.map(item => item.toLowerCase());
                        $localForage.setItem(BLOCKED_EXTRA_KEY, this.blockedExtras);
                    }
                );
            });
    }

    addFavouriteHost(name, checkExists = true) {
        if (!checkExists || !this.isFavouriteHost(name)) {
            this.favouriteHosts.push(name.toLowerCase());
        }
    }

    removeFavouriteHost(name) {
        name = name.toLowerCase();
        _.remove(this.favouriteHosts, host => host === name);
    }

    toggleFavouriteHost(name) {
        if (this.isFavouriteHost(name)) {
            this.removeFavouriteHost(name);
        } else {
            this.addFavouriteHost(name, false);
        }
    }

    isFavouriteHost(name) {
        return _.includes(this.favouriteHosts, name.toLowerCase());
    }

    addBlockedHost(name, checkExists = true) {
        if (!checkExists || !this.isBlockedHost(name)) {
            this.blockedHosts.push(name.toLowerCase());
        }
    }

    removeBlockedHost(name) {
        name = name.toLowerCase();
        _.remove(this.blockedHosts, host => host === name);
    }

    toggleBlockedHost(name) {
        if (this.isBlockedHost(name)) {
            this.removeBlockedHost(name);
        } else {
            this.addBlockedHost(name, false);
        }
    }

    isBlockedHost(name) {
        return _.includes(this.blockedHosts, name.toLowerCase());
    }
}
Hosts.$inject = ['$localForage', '$rootScope'];

export default Hosts;
