import _ from 'lodash';

class PostDetailsCtrl {
    constructor($scope, DateTime, PostNotifications, Hosts, Subreddits, $timeout) {
        this.DateTime = DateTime;
        this.PostNotifications = PostNotifications;
        this.Subreddits = Subreddits;
        this.Hosts = Hosts;
        this.$timeout = $timeout;
        this.$scope = $scope;

        this.addressOverride = false;
    }

    timePostedInAdvance() {
        return this.post.posted.from(this.post.opens, true) + ' in advance';
    }

    teamStyle() {
        return this.post.teams + (this.post.teamSize ? ' To' + this.post.teamSize : '');
    }

    showSubreddit() {
        return this.Subreddits.subreddits.length > 1;
    }

    openingTime() {
        return this.DateTime.format('POST_HEADER', this.post.opens);
    }

    openingTimeRelative() {
        return this.post.opens.from(this.DateTime.getTime()) || 'Unknown';
    }

    toggleFavourite(event) {
        event.preventDefault();
        event.stopPropagation();
        return this.Hosts.toggleFavouriteHost(this.post.author);
    }

    toggleNotification(event) {
        event.preventDefault();
        event.stopPropagation();
        this.PostNotifications.toggleNotifications(this.post.id);
    }

    isNotifying() {
        return this.PostNotifications.isNotifyingFor(this.post.id);
    }

    setAddressOverride(override) {
        this.addressOverride = override;
        this.$scope.$broadcast('regionCopyChange');
    }

    triggerCopiedMessage() {
        if (_.isEmpty(this.post.address)) {
            return;
        }

        // Toggle copied message on
        this.setAddressOverride('Copied!');

        // Toggle back after 2 seconds
        this.$timeout(() => this.setAddressOverride(false), 2000);
    }
}
PostDetailsCtrl.$inject = ['$scope', 'DateTime', 'PostNotifications', 'Hosts', 'Subreddits', '$timeout'];

function postDetails() {
    return {
        restrict: 'E',
        scope: {
            post: '='
        },
        template: require('./template.html'),
        controller: PostDetailsCtrl,
        controllerAs: 'details',
        bindToController: true
    };
}
postDetails.$inject = ['DateTime', 'PostNotifications', 'Hosts', 'Subreddits', '$timeout'];

export default postDetails;
