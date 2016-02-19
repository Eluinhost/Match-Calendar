import _ from 'lodash';

const FAV_KEY = 'favoriteHosts';
const BLOCK_KEY = 'blockedHosts';

class Hosts {
    constructor($localForage, $rootScope) {
        this.favouriteHosts = [];
        this.blockedHosts = [];

        // Set a promise to resolve on in routes
        this.initialised = $localForage.getItem([FAV_KEY, BLOCK_KEY])
            .spread((favouriteHosts, blockedHosts) => {
                _.mergeNotNull(this, {
                    favouriteHosts,
                    blockedHosts
                });

                $rootScope.$watchCollection(
                    () => this.favouriteHosts,
                    () => {
                        // Always make sure to store as lowercase
                        this.favouriteHosts = this.favouriteHosts.map(item => item.toLowerCase());
                        $localForage.setItem(FAV_KEY, this.favouriteHosts);
                        ga('set', 'metric2', this.favouriteHosts.length);
                    }
                );

                $rootScope.$watchCollection(
                    () => this.blockedHosts,
                    () => {
                        // Always make sure to store as lowercase
                        this.blockedHosts = this.blockedHosts.map(item => item.toLowerCase());
                        $localForage.setItem(BLOCK_KEY, this.blockedHosts);
                        ga('set', 'metric3', this.blockedHosts.length);
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
