import _ from 'lodash';

class SettingsCtrl {
    constructor(DurationFormatter, $uibModal, $window, Hosts, DateTime,
                PostNotifications, $localForage, $scope, Translations) {
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
        this.tempFavouriteHost = '';
        this.tempBlockedHost = '';

        const removePrefixedInput = (key, prefixes) => {
            $scope.$watch(() => this[key], () => {
                if (!this[key]) {
                    return;
                }

                const item = this[key];

                _(prefixes)
                    .filter(p => item.length > p.length && item.startsWith(p))
                    .take(1)
                    .forEach(p => {
                        this[key] = item.slice(p.length);
                    });
            });
        };

        removePrefixedInput('tempFavouriteHost', ['/u/', 'u/']);
        removePrefixedInput('tempBlockedHost', ['/u/', 'u/']);
    }

    timeZoneGroup(zone) {
        const index = zone.indexOf('/');

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
SettingsCtrl.$inject = ['DurationFormatter', '$uibModal', '$window', 'Hosts', 'DateTime',
    'PostNotifications', '$localForage', '$scope', 'Translations'];

const controllerName = 'SettingsCtrl';

const state = {
    name: 'app.settings',
    url: '/settings',
    template: require('./template.html'),
    controller: `${controllerName} as settings`,
    resolve: {
        savedData: ['$q', 'PostNotifications', 'Hosts', function ($q, ...others) {
            return $q.all(others.map(o => o.initialised));
        }]
    }
};

export { SettingsCtrl as controller, controllerName, state };

export default state;
