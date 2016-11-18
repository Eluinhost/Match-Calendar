import _ from 'lodash';

const FAVOURITE_HOST_KEY = 'favoriteHosts';
const BLOCKED_HOST_KEY = 'blockedHosts';
const FAVOURITE_TAG_KEY = 'favouriteTags';
const BLOCKED_TAG_KEY = 'blockedTags';

class Hosts {
    constructor($localForage, $rootScope) {
        this.favouriteHosts = [];
        this.blockedHosts = [];
        this.favouriteTags = [];
        this.blockedTags = [];

        // Set a promise to resolve on in routes
        this.initialised = $localForage
            .getItem([FAVOURITE_HOST_KEY, BLOCKED_HOST_KEY, FAVOURITE_TAG_KEY, BLOCKED_TAG_KEY])
            .spread((favouriteHosts, blockedHosts, favouriteTags, blockedTags) => {
                _.mergeNotNull(this, {
                    favouriteHosts,
                    blockedHosts,
                    favouriteTags,
                    blockedTags
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
                    () => this.favouriteTags,
                    () => {
                        // Always make sure to store as lowercase
                        this.favouriteTags = this.favouriteTags.map(item => item.toLowerCase());
                        $localForage.setItem(FAVOURITE_TAG_KEY, this.favouriteTags);
                    }
                );

                $rootScope.$watchCollection(
                    () => this.blockedTags,
                    () => {
                        // Always make sure to store as lowercase
                        this.blockedTags = this.blockedTags.map(item => item.toLowerCase());
                        $localForage.setItem(BLOCKED_TAG_KEY, this.blockedTags);
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

    isFavouriteTag(tag) {
        return _.includes(this.favouriteTags, tag.toLowerCase());
    }

    anyFavouriteTag(tags) {
        return _.some(tags, it => this.isFavouriteTag(it));
    }

    isBlockedTag(tag) {
        return _.includes(this.blockedTags, tag.toLowerCase());
    }

    anyBlockedTag(tags) {
        return _.some(tags, it => this.isBlockedTag(it));
    }

    addFavouriteTag(tag, checkExists = true) {
        if (!checkExists || !this.isFavouriteTag(tag)) {
            this.favouriteTags.push(tag.toLowerCase());
        }
    }

    addBlockedTag(tag, checkExists = true) {
        if (!checkExists || !this.isBlockedTag(tag)) {
            this.blockedTags.push(tag.toLowerCase());
        }
    }

    removeFavouriteTag(tag) {
        tag = tag.toLowerCase();
        _.remove(this.favouriteTags, it => it === tag);
    }

    removeBlockedTag(tag) {
        tag = tag.toLowerCase();
        _.remove(this.blockedTags, it => it === tag);
    }
}
Hosts.$inject = ['$localForage', '$rootScope'];

export default Hosts;
