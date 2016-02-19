import _ from 'lodash';
import moment from 'moment-timezone';

class PostListCtrl {
    constructor(Posts, PostNotifications, DateTime, Hosts, Changelog) {
        this.Posts = Posts;
        this.DateTime = DateTime;
        this.PostNotifications = PostNotifications;
        this.Hosts = Hosts;
        this.Changelog = Changelog;
        this.moment = moment;

        this.showFilters = false;

        this.filters = {
            search: '',
            region: post => !_.includes(Posts.disabledRegions, post.region.toLowerCase()),
            // Check if all of its gamemodes are enabled or not
            gamemode: post => !_.some(post.gamemodes, gamemode => {
                return _.includes(Posts.disabledGamemodes, gamemode.toLowerCase());
            }),
            teamType: post => !_.includes(Posts.disabledTeamTypes, post.teams.toLowerCase()),
            favourited: post => Posts.showFavouritedHostsOnly ? Hosts.isFavouriteHost(post.author) : true,
            blocked: post => Posts.showBlockedHosts ? true : !Hosts.isBlockedHost(post.author)
        };

        this.filteredPosts = [];
    }

    buttonEnabledClass(enabled) {
        return enabled ? 'btn-success' : 'btn-danger';
    }
}
PostListCtrl.$inject = ['Posts', 'PostNotifications', 'DateTime', 'Hosts', 'Changelog', 'Subreddits', 'Templates'];

let controllerName = 'PostListCtrl';

let state = {
    name: 'app.list',
    url: '/list',
    template: require('./template.html'),
    controller: `${controllerName} as postList`,
    resolve: {
        savedData: ['$q', 'Hosts', 'Posts', 'Subreddits', 'PostNotifications', '$q', function($q, ...others) {
            return $q.all(others.map(o => o.initialised));
        }]
    }
};

export { PostListCtrl as controller, controllerName, state };

export default state;
