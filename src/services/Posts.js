import _ from 'lodash';

const DISABLED_REGIONS_KEY = 'disabledRegions';
const DISABLED_TEAM_TYPES_KEY = 'disabledTeamTypes';
const DISABLED_GAMEMODES_KEY = 'disabledGamemodes';
const FAVOURITES_ONLY_KEY = 'showFavouritedHostsOnly';
const SHOW_BLOCKED_KEY = 'showBlockedHosts';

class Posts {
    constructor($rootScope, $interval, Subreddits, DateTime, MatchFetcher, $localForage) {
        this.MatchFetcher = MatchFetcher;
        this.Subreddits = Subreddits;
        this.DateTime = DateTime;
        this.$rootScope = $rootScope;

        this.posts = [];
        this.unparsed = [];

        this.lastUpdated = 0;

        this.disabledRegions = [];
        this.disabledTeamTypes = [];
        this.disabledGamemodes = [];
        this.showFavouritedHostsOnly = false;
        this.showBlockedHosts = false;

        this.initialised = $localForage
            .getItem([
                DISABLED_REGIONS_KEY, DISABLED_TEAM_TYPES_KEY, DISABLED_GAMEMODES_KEY,
                FAVOURITES_ONLY_KEY, SHOW_BLOCKED_KEY
            ])
            .spread((regions, types, gamemodes, favourites, showBlocked) => {
                // Merge saved settings into ourselves
                _.mergeNotNull(this, {
                    disabledRegions: regions,
                    disabledTeamTypes: types,
                    disabledGamemodes: gamemodes,
                    showFavouritedHostsOnly: favourites,
                    showBlockedHosts: showBlocked
                });

                $rootScope.$watchCollection(
                    () => this.disabledRegions,
                    () => $localForage.setItem(DISABLED_REGIONS_KEY, this.disabledRegions)
                );
                $rootScope.$watchCollection(
                    () => this.disabledTeamTypes,
                    () => $localForage.setItem(DISABLED_TEAM_TYPES_KEY, this.disabledTeamTypes)
                );
                $rootScope.$watchCollection(
                    () => this.disabledGamemodes,
                    () => $localForage.setItem(DISABLED_GAMEMODES_KEY, this.disabledGamemodes)
                );
                $rootScope.$watch(
                    () => this.showFavouritedHostsOnly,
                    () => $localForage.setItem(FAVOURITES_ONLY_KEY, this.showFavouritedHostsOnly)
                );
                $rootScope.$watch(
                    () => this.showBlockedHosts,
                    () => $localForage.setItem(SHOW_BLOCKED_KEY, this.showBlockedHosts)
                );
            });

        this.currentRegions = [];
        this.currentTeamTypes = [];
        this.currentGamemodes = [];

        this.errorSubs = [];

        this.updating = false;

        // Watch for subreddit changes
        this.firstQuery = Subreddits.initialised.then(() => {
            $rootScope.$watchCollection(() => Subreddits.subreddits, (oldSubs, newSubs) => {
                if (oldSubs !== newSubs) {
                    this.update();
                }
            });

            // Update every minute
            $interval(() => this.update(), 1000 * 60);
            return this.update();
        });
    }

    isGamemodeDisabled(gamemeode) {
        return this.disabledGamemodes.indexOf(gamemeode.toLowerCase()) > -1;
    }

    isTeamTypeDisabled(type) {
        return this.disabledTeamTypes.indexOf(type.toLowerCase()) > -1;
    }

    isRegionDisabled(region) {
        return this.disabledRegions.indexOf(region.toLowerCase()) > -1;
    }

    toggleGamemode(gamemode) {
        gamemode = gamemode.toLowerCase();

        const index = this.disabledGamemodes.indexOf(gamemode);

        if (index < 0) {
            this.disabledGamemodes.push(gamemode);
        } else {
            this.disabledGamemodes.splice(index, 1);
        }
    }

    toggleTeamType(type) {
        type = type.toLowerCase();

        const index = this.disabledTeamTypes.indexOf(type);

        if (index < 0) {
            this.disabledTeamTypes.push(type);
        } else {
            this.disabledTeamTypes.splice(index, 1);
        }
    }

    toggleRegion(region) {
        region = region.toLowerCase();

        const index = this.disabledRegions.indexOf(region);

        if (index < 0) {
            this.disabledRegions.push(region);
        } else {
            this.disabledRegions.splice(index, 1);
        }
    }

    update() {
        this.updating = true;

        return this.MatchFetcher
            .fetch(this.Subreddits.subreddits)
            .then(({ parsed, unparsed, errors }) => {
                const halfHourAgo = this.DateTime.getTime().subtract(30, 'minutes');

                this.posts = _.sortBy( // Sort by unix opening times
                    _.filter( // Filter out too old posts
                        parsed,
                        it => halfHourAgo.diff(it.opens) < 0
                    ),
                    it => it.opensUnix
                );
                this.unparsed = unparsed;
                this.errorSubs = errors;

                this.updateRegions();
                this.updateGamemodes();
                this.updateTeamTypes();

                this.lastUpdated = this.DateTime.getTime().unix();
                this.fireRefreshPostsEvent();
            })
            .finally(() => {
                this.updating = false;
            });
    }

    updateRegions() {
        this.currentRegions = _(this.posts).map(post => post.region.toLowerCase()).uniq().value();
    }

    updateTeamTypes() {
        this.currentTeamTypes = _(this.posts).map(post => post.teams.toLowerCase()).uniq().value();
    }

    updateGamemodes() {
        this.currentGamemodes = _(this.posts)
                .map(post => post.gamemodes)
                .flatten()
                .map(gamemode => gamemode.toLowerCase())
                .uniq()
                .value();
    }

    fireRefreshPostsEvent() {
        this.$rootScope.$broadcast('postsUpdated', this.posts);
    }
}
Posts.$inject = ['$rootScope', '$interval', 'Subreddits', 'DateTime', 'MatchFetcher', '$localForage'];

export default Posts;
