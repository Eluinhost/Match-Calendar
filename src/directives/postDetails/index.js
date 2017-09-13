import { map, capitalize, includes } from 'lodash';

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
        const name = this.post.hostingName || this.post.author;
        return `${name}'s ${this.post.tournament ? 'Tournament ' : ''}#${this.post.count}`;
    }

    getRoleClasses() {
        return map(this.post.roles, role => `role-${role.replace(/ /g, '-')}`).join(' ');
    }

    getRoleText() {
        return this.post.roles.map(role => role.split(' ').map(capitalize).join(' ')).join(', ');
    }

    getAuthorRoleIcon() {
        if (includes(this.post.roles, 'trial host')) {
            return 'bolt';
        }

        return 'shield';
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
