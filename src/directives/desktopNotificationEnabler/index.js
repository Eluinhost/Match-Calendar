import _ from 'lodash';

const HIDE_KEY = 'hideNotificationsMessage';

class NotificationEnablerCtrl {
    constructor(HtmlNotifications, $localForage, $rootScope, $translate) {
        this.HtmlNotifications = HtmlNotifications;
        this.$translate = $translate;
        this.hide = false;
        this.initialised = false;

        $localForage
            .getItem(HIDE_KEY)
            .then(hide => {
                if (!_.isNull(hide)) {
                    this.hide = hide;
                }

                this.initialised = true;
                $rootScope.$watch(() => this.hide, () => $localForage.setItem(HIDE_KEY, this.hide));
            });
    }

    show() {
        return this.initialised && (this.hide === false || this.showHideButton === false);
    }

    requestPermission() {
        return this.HtmlNotifications
            .requestPermission()
            .then(() => this.$translate('notifications.enable.notice'))
            .then(t => this.HtmlNotifications.notify(t));
    }
}
NotificationEnablerCtrl.$inject = ['HtmlNotifications', '$localForage', '$rootScope', '$translate'];

function desktopNotificationEnabler() {
    return {
        restrict: 'E',
        template: require('./template.html'),
        scope: {
            showHideButton: '=?'
        },
        controller: NotificationEnablerCtrl,
        controllerAs: 'enabler',
        bindToController: true
    };
}

export default desktopNotificationEnabler;
