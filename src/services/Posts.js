import _ from 'lodash';
import moment from 'moment-timezone';

const DISABLED_REGIONS_KEY = 'disabledRegions';
const DISABLED_TEAM_TYPES_KEY = 'disabledTeamTypes';
const DISABLED_GAMEMODES_KEY = 'disabledGamemodes';
const FAVOURITES_ONLY_KEY = 'showFavouritedHostsOnly';
const SHOW_BLOCKED_KEY = 'showBlockedHosts';

class Posts {
    constructor($rootScope, $interval, DateTime, $localForage, $http) {
        this.DateTime = DateTime;
        this.$rootScope = $rootScope;
        this.$http = $http;

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
                $rootScope.$watch(
                    () => this.showBlockedHosts,
                    () => $localForage.setItem(SHOW_BLOCKED_KEY, this.showBlockedHosts)
                );
            });

        this.currentRegions = [];
        this.currentTeamTypes = [];
        this.currentGamemodes = [];
        this.error = false;

        this.updating = false;

        // Update every minute
        $interval(() => this.update(), 1000 * 60);
        this.firstQuery = this.update();
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

        return this.$http
            .get(`${__UHCGG_API_URL__}/matches`)
            .then(raw => {
                if (raw.status >= 400) {
                    throw new Error('Server returned invalid response');
                }

                this.posts = _.map(
                    _.filter(
                        raw.data,
                        it => !it.removed
                    ),
                    post => Object.assign({}, post, {
                        opens: moment(post.opens),
                        created: moment(post.created)
                    })
                );

                this.updateRegions();
                this.updateGamemodes();
                this.updateTeamTypes();

                this.lastUpdated = this.DateTime.getTime().unix();
                this.error = false;
                this.fireRefreshPostsEvent();
            })
            .finally(() => {
                this.updating = false;
            })
            .catch(err => {
                console.error(err);
                this.error = true;
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
                .map(post => post.scenarios)
                .flatten()
                .map(scenario => scenario.toLowerCase())
                .uniq()
                .value();
    }

    fireRefreshPostsEvent() {
        this.$rootScope.$broadcast('postsUpdated', this.posts);
    }
}
Posts.$inject = ['$rootScope', '$interval', 'DateTime', '$localForage', '$http'];

export default Posts;
