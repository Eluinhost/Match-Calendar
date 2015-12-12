class SettingsCtrl {
    constructor(DurationFormatter, $uibModal, $window, Subreddits, DateTime, PostNotifications, $localForage) {
        this.Subreddits = Subreddits;
        this.DateTime = DateTime;
        this.PostNotifications = PostNotifications;
        this.$uibModal = $uibModal;
        this.$window = $window;
        this.DurationFormatter = DurationFormatter;
        this.$localForage = $localForage;

        this.sliderOptions = {
            floor: 0,
            ceil: 7200,
            step: 60,
            translate: DurationFormatter.format
        };
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
SettingsCtrl.$inject =
    ['DurationFormatter', '$uibModal', '$window', 'Subreddits', 'DateTime', 'PostNotifications', '$localForage'];

let controllerName = 'SettingsCtrl';

let state = {
    name: 'app.settings',
    url: '/settings',
    template: require('./template.html'),
    controller: `${controllerName} as settings`,
    resolve: {
        savedData: ['$q', 'Subreddits', 'PostNotifications', function($q, ...others) {
            return $q.all(others.map(o => o.initialised));
        }]
    }
};

export { SettingsCtrl as controller, controllerName, state };

export default state;
