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
                    () => $localForage.setItem(FAV_KEY, this.favouriteHosts)
                );

                $rootScope.$watchCollection(
                    () => this.blockedHosts,
                    () => $localForage.setItem(BLOCK_KEY, this.blockedHosts)
                );
            });
    }

    addFavouriteHost(name, checkExists = true) {
        if (!checkExists || !this.isFavouriteHost(name)) {
            this.favouriteHosts.push(name);
        }
    }

    removeFavouriteHost(name) {
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
        return _.contains(this.favouriteHosts, name);
    }

    addBlockedHost(name, checkExists = true) {
        if (!checkExists || !this.isBlockedHost(name)) {
            this.blockedHosts.push(name);
        }
    }

    removeBlockedHost(name) {
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
        return _.contains(this.blockedHosts, name);
    }
}
Hosts.$inject = ['$localForage', '$rootScope'];

export default Hosts;
