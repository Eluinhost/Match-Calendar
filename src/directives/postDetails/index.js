import { intersection, map } from 'lodash';

class PostDetailsCtrl {
    constructor(PostNotifications, Hosts, TeamStyles) {
        this.PostNotifications = PostNotifications;
        this.Hosts = Hosts;
        this.TeamStyles = TeamStyles;
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

    getTitle() {
        return `${this.post.author} #${this.post.count}`;
    }

    getRoleClasses() {
        return map(this.post.roles, role => `role-${role}`).join(' ');
    }

    getAuthorRoleIcon() {
        const matching = intersection(this.post.roles, ['trial', 'host', 'moderator']);

        if (!matching.length) {
            return null;
        }

        switch (matching[0]) {
        case 'host':
        case 'moderator':
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

    isFavouriteHost() {
        return this.Hosts.isFavouriteHost(this.post.author) || this.Hosts.anyFavouriteTag(this.post.tags);
    }

    isBlockedHost() {
        return this.Hosts.isBlockedHost(this.post.author) || this.Hosts.anyBlockedTag(this.post.tags);
    }
}
PostDetailsCtrl.$inject = ['PostNotifications', 'Hosts', 'TeamStyles'];

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
