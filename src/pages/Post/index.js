import _ from 'lodash';

class PostCtrl {
    constructor(Posts, DateTime, $timeout, $scope, TeamStyles, post) {
        this.$scope = $scope;
        this.DateTime = DateTime;
        this.$timeout = $timeout;
        this.TeamStyles = TeamStyles;
        this.Posts = Posts;
        this.showCopyError = false;
        this.copyMessage = 'post.copy.initial';
        this.post = post;
    }

    regionClass() {
        return this.Posts.isRegionDisabled(this.post.region) ? 'tag-danger' : 'tag-success';
    }

    showCopiedMessage() {
        this.$scope.$apply(() => {
            this.copyMessage = 'post.copy.copied';
        });
        this.$timeout(() => {
            this.copyMessage = 'post.copy.initial';
        }, 3000);
    }

    showCtrlCMessage() {
        this.$scope.$apply(() => {
            this.copyMessage = 'post.copy.fallback';
            this.showCopyError = true;
        });
        this.$timeout(() => {
            this.copyMessage = 'post.copy.initial';
        }, 5000);
    }

    teamStyle() {
        if (this.post.teams === 'custom') {
            return this.post.customStyle;
        }

        const style = this.TeamStyles[this.post.teams];

        if (!style) {
            return `Unknown team style: ${style}`;
        }

        if (style.requiresTeamSize) {
            return `${style.display} To${this.post.size}`;
        }

        return style.display;
    }

    relativeTimeClass() {
        const time = this.post.opens.diff(this.DateTime.getTime());

        if (time < 0) {
            return 'tag-danger';
        }

        if (time < 600000) {
            return 'tag-warning';
        }

        return 'tag-success';
    }
}
PostCtrl.$inject = ['Posts', 'DateTime', '$timeout', '$scope', 'TeamStyles', 'post'];

const controllerName = 'PostCtrl';

const resolvePost = function (Posts, $stateParams, $q, $state) {
    // Redirect to listing if no id is provided
    if (_.isEmpty($stateParams.id)) {
        $state.go('app.list');
        return $q.reject();
    }

    // Wait until initial query completes
    return Posts.firstQuery
        .then(() => {
            // Check if we already know about the post
            const post = _.find(Posts.posts, { id: Number($stateParams.id) });

            if (post) {
                return post;
            }

            $state.go('app.post404', { id: $stateParams.id });
            return $q.reject('not found');
        });
};
resolvePost.$inject = ['Posts', '$stateParams', '$q', '$state'];

const state = {
    name: 'app.post',
    url: '/post/:id',
    template: require('./template.html'),
    controller: `${controllerName} as post`,
    resolve: {
        post: resolvePost
    }
};

export { PostCtrl as controller, controllerName, state };

export default state;
