import _ from 'lodash';

const HIDE_KEY = 'hideNotificationsMessage';

class NotificationEnablerCtrl {
    constructor(HtmlNotifications, $localForage, $rootScope) {
        this.HtmlNotifications = HtmlNotifications;
        this.hide = false;
        this.intiialised = false;

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
            .then(() => this.HtmlNotifications.notify('Notifications Enabled!'));
    }
}
NotificationEnablerCtrl.$inject = ['HtmlNotifications', '$localForage', '$rootScope'];

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
