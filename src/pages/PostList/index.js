import _ from 'lodash';
import moment from 'moment-timezone';

class PostListCtrl {
    constructor($rootScope, Posts, $stateParams, $timeout, PostNotifications, DateTime, Hosts, Changelog) {
        this.Posts = Posts;
        this.DateTime = DateTime;
        this.PostNotifications = PostNotifications;
        this.Hosts = Hosts;
        this.Changelog = Changelog;
        this.moment = moment;

        this.showFilters = false;

        this.filters = {
            search: '',
            region: post => !_.contains(Posts.disabledRegions, post.region.toLowerCase()),
            // Check if all of its gamemodes are enabled or not
            gamemode: post => !_.any(post.gamemodes, gamemode => {
                return _.contains(Posts.disabledGamemodes, gamemode.toLowerCase());
            }),
            teamType: post => !_.contains(Posts.disabledTeamTypes, post.teams.toLowerCase()),
            favourited: post => Posts.showFavouritedHostsOnly ? Hosts.isFavouriteHost(post.author) : true,
            blocked: post => Posts.showBlockedHosts ? true : !Hosts.isBlockedHost(post.author)
        };

        this.filteredPosts = [];

        // Handle 'anchor' links to specific posts
        this.scrolled = false;
        $rootScope.$on('postsUpdated', () => {
            $timeout(() => {
                if (this.scrolled) {
                    return;
                }

                if ($stateParams.post !== null) {
                    let element = document.getElementById('post-' + $stateParams.post);
                    if (element !== null) {
                        element.scrollIntoView();
                        element.click();
                    }
                }

                this.scrolled = true;
            });
        });
    }

    postClasses(post) {
        let classes = ['match-post'];

        if (this.Hosts.isFavouriteHost(post.author)) {
            classes.push('favourite-host');
        }

        return classes;
    }

    buttonEnabledClass(enabled) {
        return enabled ? 'btn-success' : 'btn-danger';
    }
}
PostListCtrl.$inject = ['$rootScope', 'Posts', '$stateParams', '$timeout', 'PostNotifications', 'DateTime', 'Hosts',
    'Changelog', 'Subreddits', 'Templates'];

let controllerName = 'PostListCtrl';

let state = {
    name: 'app.list',
    url: '/list?post',
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
