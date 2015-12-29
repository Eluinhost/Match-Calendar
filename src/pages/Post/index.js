import _ from 'lodash';

class PostCtrl {
    constructor($stateParams, $state, Posts, DateTime, $timeout, $scope) {
        this.$scope = $scope;
        this.DateTime = DateTime;
        this.$timeout = $timeout;
        this.Posts = Posts;
        this.showCopyError = false;
        this.copyMessage = 'post.copy.initial';

        if (_.isEmpty($stateParams.id)) {
            this.goBackToList();
            return;
        }

        this.post = _.find(Posts.posts, p => p.id === $stateParams.id);

        if (_.isUndefined(this.post)) {
            $state.go('app.post404', {id: $stateParams.id});
        }
    }

    regionClass() {
        return this.Posts.isRegionDisabled(this.post.region) ? 'label-danger' : 'label-success';
    }

    showCopiedMessage() {
        this.$scope.$apply(() => this.copyMessage = 'post.copy.copied');
        this.$timeout(() => this.copyMessage = 'post.copy.initial', 3000);
    }

    showCtrlCMessage() {
        this.$scope.$apply(() => {
            this.copyMessage = 'post.copy.fallback';
            this.showCopyError = true;
        });
        this.$timeout(() => this.copyMessage = 'post.copy.initial', 5000);
    }

    openingTime() {
        return this.DateTime.format('POST_HEADER', this.post.opens);
    }

    teamStyle() {
        return this.post.teams + (this.post.teamSize ? ' To' + this.post.teamSize : '');
    }

    openingTimeRelative() {
        return this.post.opens.from(this.DateTime.getTime());
    }

    relativeTimeClass() {
        let time = this.post.opens.diff(this.DateTime.getTime());

        if (time < 0) {
            return 'label-danger';
        }

        if (time < 600000) {
            return 'label-warning';
        }

        return 'label-success';
    }
}
PostCtrl.$inject = ['$stateParams', '$state', 'Posts', 'DateTime', '$timeout', '$scope'];

let controllerName = 'PostCtrl';

let state = {
    name: 'app.post',
    url: '/post/:id',
    template: require('./template.html'),
    controller: `${controllerName} as post`,
    resolve: {
        savedData: ['Posts', function(Posts) {
            // Only load once posts have loaded at least once
            return Posts.firstQuery;
        }]
    }
};

export { PostCtrl as controller, controllerName, state };

export default state;
