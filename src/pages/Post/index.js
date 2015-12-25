import _ from 'lodash';

class PostCtrl {
    constructor($stateParams, $state, Posts, DateTime, $timeout, $scope) {
        this.$scope = $scope;
        this.$state = $state;
        this.DateTime = DateTime;
        this.$timeout = $timeout;
        this.Posts = Posts;
        this.showCopyError = false;

        if (_.isEmpty($stateParams.id)) {
            this.goBackToList();
            return;
        }

        this.post = _.find(Posts.posts, p => p.id === $stateParams.id);

        if (_.isUndefined(this.post)) {
            this.goBackToList();
        }

        this.copyMessage = 'Copy to clipboard';
    }

    regionClass() {
        return this.Posts.isRegionDisabled(this.post.region) ? 'label-danger' : 'label-success';
    }

    showCopiedMessage() {
        this.$scope.$apply(() => this.copyMessage = 'Copied!');
        this.$timeout(() => this.copyMessage = 'Copy to clipboard', 3000);
    }

    showCtrlCMessage() {
        this.$scope.$apply(() => {
            this.copyMessage = 'Press Ctrl + C';
            this.showCopyError = true;
        });
        this.$timeout(() => this.copyMessage = 'Copy to clipboard', 5000);
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

    goBackToList() {
        this.$state.go('app.list');
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
