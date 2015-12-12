import _ from 'lodash';

const KEY = 'favoriteHosts';

class Hosts {
    constructor($localForage, $rootScope) {
        this.favouriteHosts = [];

        // Set a promise to resolve on in routes
        this.initialised = $localForage.getItem(KEY)
            .then(value => {
                if (!_.isNull(value)) {
                    this.favouriteHosts = value;
                }

                $rootScope.$watchCollection(
                    () => this.favouriteHosts,
                    () => $localForage.setItem(KEY, this.favouriteHosts)
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
}
Hosts.$inject = ['$localForage', '$rootScope'];

export default Hosts;
