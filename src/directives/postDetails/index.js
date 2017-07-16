import _ from 'lodash';

class PostDetailsCtrl {
    constructor($scope, PostNotifications, Hosts, $timeout, $state) {
        this.PostNotifications = PostNotifications;
        this.Hosts = Hosts;
        this.$timeout = $timeout;
        this.$scope = $scope;
        this.$state = $state;

        this.addressOverride = false;
    }

    timePostedInAdvance() {
        return `${this.post.posted.from(this.post.opens, true)} in advance`;
    }

    teamStyle() {
        let style = this.post.teams;

        if (this.post.teamSize) {
            style += ` To${this.post.teamSize}`;
        }

        return style;
    }

    getAuthorRoleIcon() {
        switch (this.post.authorRole) {
        case 'verified':
        case 'advisor':
            return 'shield';
        case 'trial':
            return 'bolt';
        default:
            return null;
        }
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

    isFavouriteHost() {
        return this.Hosts.isFavouriteHost(this.post.author) || this.Hosts.anyFavouriteTag(this.post.tags);
    }

    isBlockedHost() {
        return this.Hosts.isBlockedHost(this.post.author) || this.Hosts.anyBlockedTag(this.post.tags);
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
PostDetailsCtrl.$inject = ['$scope', 'PostNotifications', 'Hosts', '$timeout', '$state'];

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

export default postDetails;
