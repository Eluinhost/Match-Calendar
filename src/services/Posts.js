import _ from 'lodash';

let DISABLED_REGIONS_KEY = 'disabledRegions';
let DISABLED_TEAM_TYPES_KEY = 'disabledTeamTypes';
let DISABLED_GAMEMODES_KEY = 'disabledGamemodes';
let FAVOURITES_ONLY_KEY = 'showFavouritedHostsOnly';
let SHOW_BLOCKED_KEY = 'showBlockedHosts';

class Posts {
    constructor($rootScope, $interval, Subreddits, DateTime, RedditPostsService, $localForage) {
        this.RedditPostsService = RedditPostsService;
        this.Subreddits = Subreddits;
        this.DateTime = DateTime;
        this.$rootScope = $rootScope;

        this.posts = [];

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
            });

        this.currentRegions = [];
        this.currentTeamTypes = [];
        this.currentGamemodes = [];

        this.errorSubs = [];

        this.updating = false;

        // Watch for subreddit changes
        Subreddits.initialised.then(() => {
            $rootScope.$watchCollection(() => Subreddits.subreddits, () => this.update());

            // Update every minute
            $interval(() => this.update(), 1000 * 60);
            this.update();
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

        let index = this.disabledGamemodes.indexOf(gamemode);

        if (index < 0) {
            this.disabledGamemodes.push(gamemode);
        } else {
            this.disabledGamemodes.splice(index, 1);
        }
    }

    toggleTeamType(type) {
        type = type.toLowerCase();

        let index = this.disabledTeamTypes.indexOf(type);

        if (index < 0) {
            this.disabledTeamTypes.push(type);
        } else {
            this.disabledTeamTypes.splice(index, 1);
        }
    }

    toggleRegion(region) {
        region = region.toLowerCase();

        let index = this.disabledRegions.indexOf(region);

        if (index < 0) {
            this.disabledRegions.push(region);
        } else {
            this.disabledRegions.splice(index, 1);
        }
    }

    update() {
        this.updating = true;

        return this.RedditPostsService
            .query(this.Subreddits.subreddits, 100)
            .then(data => {
                this.posts = data.posts;
                this.errorSubs = data.errors;

                this.updateRegions();
                this.updateGamemodes();
                this.updateTeamTypes();

                this.lastUpdated = this.DateTime.getTime().unix();
                this.fireRefreshPostsEvent();
            })
            .finally(() => this.updating = false);
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
Posts.$inject = ['$rootScope', '$interval', 'Subreddits', 'DateTime', 'RedditPostsService', '$localForage'];

export default Posts;
