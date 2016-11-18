import { includes, some, debounce } from 'lodash';
import moment from 'moment-timezone';

class PostListCtrl {
    constructor(Posts, Subreddits, PostNotifications, DateTime, Hosts,
                Changelog, $stateParams, $state, $scope, $uibModal) {
        this.Posts = Posts;
        this.DateTime = DateTime;
        this.PostNotifications = PostNotifications;
        this.Hosts = Hosts;
        this.Changelog = Changelog;
        this.moment = moment;

        this.showFilters = false;

        if ($stateParams.addsub) {
            const sub = $stateParams.addsub;
            $stateParams.addsub = null;

            if (!includes(Subreddits.subreddits, sub)) {
                $uibModal.open({
                    size: 'md',
                    controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                        $scope.complete = function (add) {
                            // Check if it contains it again in case multiple modals pop up for some reason
                            if (add && !includes(Subreddits.subreddits, sub)) {
                                Subreddits.subreddits.push(sub);
                            }
                            $uibModalInstance.close();
                        };
                    }],
                    template: `
<div class="modal-body">
    <div class="modal-header"><h3 translate="list.addSub.header" translate-value-subreddit="${sub}"></h3></div>
    <div class="modal-body" translate="list.addSub.message" translate-value-subreddit="${sub}"></div>
    <div class="row modal-footer">
        <button translate="list.addSub.confirm" class="btn btn-block btn-success" ng-click="complete(true)"></button>
        <button translate="list.addSub.ignore" class="btn btn-block btn-danger" ng-click="complete(false)"></button>
    </div>
</div>`
                });
            }
        }

        this.filters = {
            search: $stateParams.filter || '',
            region: post => !includes(Posts.disabledRegions, post.region.toLowerCase()),
            // Check if all of its gamemodes are enabled or not
            gamemode: post => !some(post.gamemodes, gamemode => {
                return includes(Posts.disabledGamemodes, gamemode.toLowerCase());
            }),
            teamType: post => !includes(Posts.disabledTeamTypes, post.teams.toLowerCase()),
            favourited: post => Posts.showFavouritedHostsOnly ?
                (Hosts.isFavouriteHost(post.author) || Hosts.anyFavouriteTag(post.tags)) :
                true,
            blocked: post => Posts.showBlockedHosts ?
                true :
                (!Hosts.isBlockedHost(post.author) && !Hosts.anyBlockedTag(post.tags))
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
PostListCtrl.$inject = ['Posts', 'Subreddits', 'PostNotifications', 'DateTime', 'Hosts', 'Changelog', '$stateParams',
    '$state', '$scope', '$uibModal'];

const controllerName = 'PostListCtrl';

const state = {
    name: 'app.list',
    url: '/list?filter&addsub',
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
