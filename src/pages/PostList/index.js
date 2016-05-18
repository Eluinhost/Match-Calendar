import { includes, some, debounce } from 'lodash';
import moment from 'moment-timezone';

class PostListCtrl {
    constructor(Posts, PostNotifications, DateTime, Hosts, Changelog, $stateParams, $state, $scope) {
        this.Posts = Posts;
        this.DateTime = DateTime;
        this.PostNotifications = PostNotifications;
        this.Hosts = Hosts;
        this.Changelog = Changelog;
        this.moment = moment;

        this.showFilters = false;

        this.filters = {
            search: $stateParams.filter || '',
            region: post => !includes(Posts.disabledRegions, post.region.toLowerCase()),
            // Check if all of its gamemodes are enabled or not
            gamemode: post => !some(post.gamemodes, gamemode => {
                return includes(Posts.disabledGamemodes, gamemode.toLowerCase());
            }),
            teamType: post => !includes(Posts.disabledTeamTypes, post.teams.toLowerCase()),
            favourited: post => Posts.showFavouritedHostsOnly ? Hosts.isFavouriteHost(post.author) : true,
            blocked: post => Posts.showBlockedHosts ? true : !Hosts.isBlockedHost(post.author)
        };

        const debouncedUrlUpdated = debounce(newVal => {
            $state.transitionTo('app.list', { filter: newVal }, { notify: false });
        }, 300);

        $scope.$watch(() => this.filters.search, debouncedUrlUpdated);

        this.filteredPosts = [];
    }

    buttonEnabledClass(enabled) {
        return enabled ? 'btn-success' : 'btn-danger';
    }
}
PostListCtrl.$inject =
    ['Posts', 'PostNotifications', 'DateTime', 'Hosts', 'Changelog', '$stateParams', '$state', '$scope'];

const controllerName = 'PostListCtrl';

const state = {
    name: 'app.list',
    url: '/list?filter',
    template: require('./template.html'),
    controller: `${controllerName} as postList`,
    resolve: {
        savedData: ['$q', 'Hosts', 'Posts', 'Subreddits', 'PostNotifications', '$q', function ($q, ...others) {
            return $q.all(others.map(o => o.initialised));
        }]
    }
};

export { PostListCtrl as controller, controllerName, state };

export default state;
