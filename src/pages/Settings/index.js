class SettingsCtrl {
    constructor(DurationFormatter, $uibModal, $window, Subreddits, Hosts, DateTime,
                PostNotifications, $localForage, $scope, Translations) {
        this.Subreddits = Subreddits;
        this.DateTime = DateTime;
        this.PostNotifications = PostNotifications;
        this.$uibModal = $uibModal;
        this.$window = $window;
        this.Hosts = Hosts;
        this.DurationFormatter = DurationFormatter;
        this.$localForage = $localForage;
        this.Translations = Translations;

        this.sliderOptions = {
            floor: 0,
            ceil: 7200,
            step: 60,
            translate: DurationFormatter.format
        };
        this.tempSubreddit = '';
        this.tempFavouriteHost = '';
        this.tempBlockedHost = '';

        $scope.$watch(() => this.tempSubreddit, () => {
            if (!this.tempSubreddit) {
                return;
            }

            // Only cut beginning off if they typed past it

            if (this.tempSubreddit.startsWith('/r/') && this.tempSubreddit.length > 3) {
                this.tempSubreddit = this.tempSubreddit.slice(3);
                return;
            }

            if (this.tempSubreddit.startsWith('r/') && this.tempSubreddit.length > 2) {
                this.tempSubreddit = this.tempSubreddit.slice(2);
            }
        });

        $scope.$watch(() => this.tempFavouriteHost, () => {
            if (!this.tempFavouriteHost) {
                return;
            }

            // Only cut beginning off if they typed past it

            if (this.tempFavouriteHost.startsWith('/u/') && this.tempFavouriteHost.length > 3) {
                this.tempFavouriteHost = this.tempFavouriteHost.slice(3);
                return;
            }

            if (this.tempFavouriteHost.startsWith('u/') && this.tempFavouriteHost.length > 2) {
                this.tempFavouriteHost = this.tempFavouriteHost.slice(2);
            }
        });

        // TODO replace these watchers with something generic

        $scope.$watch(() => this.tempBlockedHost, () => {
            if (!this.tempBlockedHost) {
                return;
            }

            // Only cut beginning off if they typed past it

            if (this.tempBlockedHost.startsWith('/u/') && this.tempBlockedHost.length > 3) {
                this.tempBlockedHost = this.tempBlockedHost.slice(3);
                return;
            }

            if (this.tempBlockedHost.startsWith('u/') && this.tempBlockedHost.length > 2) {
                this.tempBlockedHost = this.tempBlockedHost.slice(2);
            }
        });
    }

    timeZoneGroup(zone) {
        let index = zone.indexOf('/');

        if (index === -1) {
            return 'Other';
        }

        return zone.substring(0, zone.indexOf('/'));
    }

    clearStorage() {
        // Attempt to clear storage
        this.$localForage.clear()
            // Reload on success to allow defaults to be applied again
            .then(() => this.$window.location.reload())
            // On failure show a modal, never seen this happen myself
            .catch(() => this.$uibModal.open({
                template: 'Failed to clear storage. You may need to clear it manually' }
            ));
    }
}
SettingsCtrl.$inject = ['DurationFormatter', '$uibModal', '$window', 'Subreddits', 'Hosts', 'DateTime',
    'PostNotifications', '$localForage', '$scope', 'Translations'];

let controllerName = 'SettingsCtrl';

let state = {
    name: 'app.settings',
    url: '/settings',
    template: require('./template.html'),
    controller: `${controllerName} as settings`,
    resolve: {
        savedData: ['$q', 'Subreddits', 'PostNotifications', 'Hosts', function($q, ...others) {
            return $q.all(others.map(o => o.initialised));
        }]
    }
};

export { SettingsCtrl as controller, controllerName, state };

export default state;
